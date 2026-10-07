require "rails_helper"

# Covers WebApp::Budget::Items::IndexController, the dashboard narrowed to a
# single budget category's items.
RSpec.describe "WebApp::Budget::Items::IndexController", :inertia do
  subject(:get_items) { get path }

  let(:path) { "/budget/7/2026/items/#{category_slug}" }
  let(:category_slug) { fixed_expense_item.category.slug }
  let(:user) { create(:user) }
  let(:user_group) { user.group }
  let(:interval) do
    create(:budget_interval, :current, :set_up, user_group:)
  end
  let(:change_set) { create(:budget_change_set, :adjust, interval:) }

  let!(:fixed_expense_item) do
    build_item(factory: :monthly_expense, amount: -100_00)
  end

  around do |example|
    travel_to(Time.zone.local(2026, 7, 15, 12, 0, 0)) { example.run }
  end

  before do
    sign_in(user)
    # an item in another category; excluded from items but not discretionary
    build_item(factory: :monthly_revenue, amount: 500_00)
  end

  def build_item(factory:, amount:, category: nil)
    attrs = { interval: }
    attrs[:category] = category if category
    create(factory, **attrs).tap do |item|
      item.category.update!(user_group:)
      create(:budget_item_event, :item_create,
        item:, user:, amount:, change_set:)
    end
  end

  it "renders the items component" do
    get_items

    expect(response).to have_http_status(:ok)
    expect_inertia.to render_component("budget/items")
  end

  describe "items" do
    subject(:items) do
      get_items
      inertia.props[:items]
    end

    it "only includes items in the requested category" do
      expect(items.pluck(:key)).to eq [ fixed_expense_item.key ]
    end

    it "reports per diem as disabled for a fixed item" do
      expect(items.first[:isPerDiemEnabled]).to be false
    end

    context "when the category has per diem enabled" do
      let(:category_slug) { per_diem_item.category.slug }
      let(:per_diem_item) do
        build_item(
          factory: :weekly_expense,
          amount: -70_00,
          category: create(:category, :weekly, :expense,
            is_per_diem_enabled: true)
        )
      end

      it "reports per diem as enabled" do
        expect(items.first[:isPerDiemEnabled]).to be true
      end
    end

    context "when the category has a cleared item" do
      let!(:cleared_item) do
        build_item(
          factory: :monthly_expense,
          amount: -20_00,
          category: fixed_expense_item.category
        )
      end

      before do
        create(:transaction_detail, budget_item: cleared_item, amount: -20_00)
      end

      it "includes the cleared item" do
        expect(items.pluck(:key))
          .to contain_exactly(fixed_expense_item.key, cleared_item.key)
      end
    end
  end

  describe "transactionDetails" do
    subject(:transaction_details) do
      get_items
      inertia.props[:items].first[:transactionDetails]
    end

    # variable items can have many details; fixed items only one
    let(:category_slug) { variable_item.category.slug }
    let(:variable_item) do
      build_item(factory: :weekly_expense, amount: -100_00)
    end
    let!(:entries) do
      account = create(:account, user_group:, name: "Checking")

      {
        cleared: create_entry(
          account:, clearance_date: Date.new(2026, 7, 10), amount: -40_00
        ),
        pending: create_entry(account:, clearance_date: nil, amount: -15_00),
      }
    end

    def create_entry(account:, clearance_date:, amount:)
      create(
        :transaction_entry,
        account:,
        clearance_date:,
        description: "Store",
        details_attributes: [
          { key: KeyGenerator.call, amount:, budget_item: variable_item },
        ]
      )
    end

    it "lists pending details first, then cleared" do
      expect(transaction_details.pluck(:transactionKey))
        .to eq [ entries[:pending].key, entries[:cleared].key ]
    end

    it "serializes the detail with its entry and account" do
      cleared_entry = entries[:cleared]

      expect(transaction_details.last).to eq(
        key: cleared_entry.details.first.key,
        amount: { display: "-40.00", cents: -40_00 },
        transactionKey: cleared_entry.key,
        description: "Store",
        clearanceDate: "July 10, 2026",
        isPending: false,
        accountName: "Checking",
        accountSlug: cleared_entry.account.slug
      )
    end
  end

  describe "discretionary" do
    subject(:discretionary) do
      get_items
      inertia.props[:discretionary]
    end

    # month-wide: -100 + 500 = 400, not just the category's -100
    it "serializes the month-wide discretionary totals" do
      expect(discretionary[:remaining]).to eq(display: "400.00", cents: 400_00)
    end
  end

  describe "budgetMonth" do
    subject(:budget_month) do
      get_items
      inertia.props[:budgetMonth]
    end

    it "links the neighbors to the category's items page" do
      expect(budget_month[:nextMonth][:href])
        .to eq "/budget/8/2026/items/#{category_slug}"
      expect(budget_month[:previousMonth][:href])
        .to eq "/budget/6/2026/items/#{category_slug}"
    end
  end

  describe "pageData" do
    subject(:page_data) do
      get_items
      inertia.props[:pageData]
    end

    it "reports the month, year and category slug as route segments" do
      expect(page_data[:redirectSegments])
        .to eq [ :budget, 7, 2026, "items", category_slug ]
    end
  end

  context "when no items match the category slug" do
    let(:category_slug) { "not-a-category" }

    it "redirects to the dashboard for the month with a warning" do
      get_items

      expect(response).to redirect_to("/budget/7/2026")
      expect(flash[:warning]).to eq "No budget items found for `not-a-category`"
    end
  end
end
