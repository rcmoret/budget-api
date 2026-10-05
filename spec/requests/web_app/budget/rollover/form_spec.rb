require "rails_helper"

RSpec.describe "WebApp::Budget::Rollover::FormController", :inertia do
  subject(:get_form) { get path }

  let(:path) { "/budget/#{interval.month}/#{interval.year}/roll-over" }
  let(:user) { create(:user) }
  let(:user_group) { user.group }
  let(:interval) { create(:budget_interval, month: 6, year: 2026, user_group:) }
  let(:setup_change_set) { Budget::Changes::Setup.create(interval:) }

  let(:groceries) do
    create(:category, :weekly, :expense, name: "Groceries", user_group:)
  end
  let(:rent) do
    create(:category, :monthly, :expense, name: "Rent", user_group:)
  end

  # One variable item rolls over as a Simple category with its event already
  # assigned. Two monthly items make a Complex category whose items start
  # unassigned. Either way items stay unreviewed until an adjustment is set.
  let!(:groceries_item) { review_item(category: groceries) }
  let!(:rent_items) { Array.new(2) { review_item(category: rent) } }

  around do |example|
    travel_to(Time.zone.local(2026, 7, 15, 12, 0, 0)) { example.run }
  end

  before { sign_in(user) }

  def review_item(category:, amount: -100_00)
    create(:budget_item, category:, interval:).tap do |item|
      create(:budget_item_event, :item_create,
        item:, user:, amount:, change_set: setup_change_set)
    end
  end

  def rollover_path(slug)
    "/budget/#{interval.month}/#{interval.year}/roll-over/#{slug}"
  end

  it "renders the rollover component" do
    get_form

    expect(response).to have_http_status(:ok)
    expect_inertia.to render_component("budget/planning/rollover/index")
  end

  it "starts a change set when there isn't one" do
    expect { get_form }
      .to change { Budget::Changes::Rollover.where(interval:).count }.by(1)
  end

  it "reuses an existing change set" do
    get_form

    expect { get rollover_path(rent.slug) }
      .not_to(change { Budget::Changes::Rollover.where(interval:).count })
  end

  it "features the first category by name when no slug is given" do
    get_form

    expect(inertia.props[:featuredCategory]).to include(
      key: groceries.key,
      slug: groceries.slug
    )
    expect(inertia.props[:featuredCategory][:items].pluck(:key))
      .to contain_exactly(groceries_item.key)
  end

  it "features the category matching the slug" do
    get rollover_path(rent.slug)

    expect(inertia.props[:featuredCategory]).to include(
      slug: rent.slug,
      unreviewed: true
    )
    expect(inertia.props[:featuredCategory][:items]).to all(include(
      eventKey: nil,
      isReviewed: false
    ))
    expect(inertia.props[:featuredCategory][:items].pluck(:key))
      .to match_array(rent_items.map(&:key))
  end

  describe "groups" do
    subject(:groups) do
      get rollover_path(rent.slug)
      inertia.props[:groups]
    end

    it "groups expenses and leaves out revenues when there are none" do
      expect(groups.keys).to eq %i[accruals expenses]
      expect(groups[:accruals][:categories]).to be_empty
    end

    it "lists each category with a route, selection state and item status" do
      expect(groups[:expenses][:categories]).to eq [
        {
          key: groceries.key,
          name: "Groceries",
          slug: groceries.slug,
          unappliedAmount: { cents: 0, display: "0.00" },
          isReviewed: false,
          isSelected: false,
          route: rollover_path(groceries.slug),
          items: [ { isReviewed: false, isValid: true } ],
        },
        {
          key: rent.key,
          name: "Rent",
          slug: rent.slug,
          unappliedAmount: { cents: 0, display: "0.00" },
          isReviewed: false,
          isSelected: true,
          route: rollover_path(rent.slug),
          items: Array.new(2) { { isReviewed: false, isValid: true } },
        },
      ]
    end

    it "summarizes each group" do
      expect(groups[:expenses]).to include(
        key: "expenses",
        label: "Expenses",
        name: "Expense",
        metadata: {
          count: 2,
          unreviewed: 2,
          isReviewed: 0,
          isSelected: true,
          sum: { cents: 0, display: "0.00" },
        }
      )
    end

    context "with accrual and revenue categories" do
      def insurance = Budget::Category.find_by!(name: "Insurance")
      def salary = Budget::Category.find_by!(name: "Salary")

      before do
        review_item(category: create(:category, :monthly, :expense, :accrual,
          name: "Insurance", user_group:))
        review_item(
          category: create(:category, :monthly, :revenue,
            name: "Salary", user_group:),
          amount: 100_00
        )
      end

      it "orders the groups accruals, revenues, expenses" do
        expect(groups.keys).to eq %i[accruals revenues expenses]
        expect(groups[:accruals][:categories].pluck(:slug))
          .to eq [ insurance.slug ]
        expect(groups[:revenues][:categories].pluck(:slug))
          .to eq [ salary.slug ]
      end

      it "features the first accrual when no slug is given" do
        get_form

        expect(inertia.props[:featuredCategory]).to include(
          slug: insurance.slug,
          isAccrual: true
        )
      end
    end
  end

  it "links to the neighboring categories" do
    get rollover_path(groceries.slug)

    expect(inertia.props[:neighborLinks]).to include(
      currentCategoryHref: rollover_path(groceries.slug),
      nextCategorySlug: rent.slug,
      nextCategoryHref: rollover_path(rent.slug),
      previousCategorySlug: rent.slug,
      nextUnreviewedCategorySlug: rent.slug
    )
  end

  it "is not submittable while any category is unreviewed" do
    get_form

    expect(inertia.props[:isSubmittable]).to be false
  end

  it "redirects when the slug doesn't match a category" do
    get rollover_path("not-a-category")

    expect(response).to redirect_to(
      "/budget/#{interval.month}/#{interval.year}/roll-over"
    )
    expect(flash[:warning]).to match(/not-a-category/)
  end
end
