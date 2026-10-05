require "rails_helper"

RSpec.describe "WebApp::Budget::Rollover unapplied target", :inertia do
  let(:user) { create(:user) }
  let(:user_group) { user.group }
  let(:interval) { create(:budget_interval, month: 6, year: 2026, user_group:) }
  let(:setup_change_set) { Budget::Changes::Setup.create(interval:) }
  let(:path) { "/budget/#{interval.month}/#{interval.year}/roll-over" }
  let(:groceries) do
    create(:category, :weekly, :expense, name: "Groceries", user_group:)
  end
  let(:dining) do
    create(:category, :weekly, :expense, name: "Dining", user_group:)
  end

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

  # Starts the change set, then reviews the (Simple) category's single item
  # with the given adjustment.
  def review(category:, adjustment:, amount: -100_00)
    item = review_item(category:, amount:)
    get path
    put "#{path}/#{category.slug}",
      params: { item: { key: item.key, adjustment: { cents: adjustment } } }
  end

  def target_params(category)
    {
      key: KeyGenerator.call,
      eventType: Budget::EventTypes::ITEM_CREATE,
      budgetCategoryKey: category.key,
      budgetItemKey: KeyGenerator.call,
      name: category.name,
      slug: category.slug,
    }
  end

  def stored_target
    Budget::Changes::Rollover
      .find_by!(interval:)
      .data_model
      .unapplied_target_event
  end

  def unapplied_props
    get path
    inertia.props[:unapplied]
  end

  describe "PUT /roll-over" do
    before { review(category: groceries, adjustment: 0) }

    it "stores the target for the upcoming month" do
      put path, params: { target: target_params(dining) }, as: :json

      expect(stored_target).to include(
        "budget_category_key" => dining.key,
        "name" => "Dining",
        "is_expense" => true,
        "month" => 7,
        "year" => 2026
      )
      expect(response).to redirect_to(path)
    end

    it "keeps the featured category when a slug is given" do
      put path, params: {
        slug: groceries.slug,
        target: target_params(dining),
      }, as: :json

      expect(response).to redirect_to("#{path}/#{groceries.slug}")
    end

    it "clears the target" do
      put path, params: { target: target_params(dining) }, as: :json

      put path, params: { target: nil }, as: :json

      expect(stored_target).to be_nil
    end

    it "rejects the wrong kind of category with a warning" do
      salary = create(:category, :monthly, :revenue, user_group:)

      put path, params: { target: target_params(salary) }, as: :json

      expect(stored_target).to be_nil
      expect(flash[:warning]).to match(/must be an expense category/)
      expect(response).to redirect_to(path)
    end
  end

  describe "props" do
    it "offers expense categories for a negative total" do
      review(category: groceries, adjustment: 0)

      expect(unapplied_props).to include(
        total: { cents: -100_00, display: "-100.00" },
        scope: "expenses",
        targetEvent: nil,
        isTargetValid: false,
        isReady: true,
        targetMonth: 7,
        targetYear: 2026
      )
    end

    it "offers revenue categories for a positive total" do
      tips = create(:category, :weekly, :revenue, user_group:)
      review(category: tips, adjustment: 0, amount: 100_00)

      expect(unapplied_props).to include(scope: "revenues")
    end

    it "needs no target when everything rolls over" do
      review(category: groceries, adjustment: -100_00)

      expect(unapplied_props).to include(
        total: { cents: 0, display: "0.00" },
        scope: nil,
        isTargetValid: true
      )
      expect(inertia.props[:isSubmittable]).to be true
    end

    it "isn't submittable until a target is picked" do
      review(category: groceries, adjustment: 0)
      get path
      expect(inertia.props[:isSubmittable]).to be false

      put path, params: { target: target_params(dining) }, as: :json
      get path

      expect(inertia.props[:isSubmittable]).to be true
      expect(inertia.props[:unapplied][:targetEvent]).to include(
        name: "Dining",
        budgetCategoryKey: dining.key
      )
    end
  end
end
