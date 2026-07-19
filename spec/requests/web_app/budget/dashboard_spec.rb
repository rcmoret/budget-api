require "rails_helper"

# Covers the serialization behavior of WebApp::Budget::DashboardController, a
# PageController. Exercising it end-to-end through a request also covers the
# presenters it wires up (DashboardPresenter, BudgetMonthPresenter,
# DiscretionaryPresenter) and the serializers they feed.
RSpec.describe "WebApp::Budget::DashboardController", :inertia do
  subject(:get_dashboard) { get path }

  let(:path) { "/budget" }
  let(:user) { create(:user) }
  let(:user_group) { user.group }
  let(:interval) do
    create(:budget_interval, :current, :set_up, user_group:)
  end
  let(:change_set) { create(:budget_change_set, :adjust, interval:) }

  # One item in each of the four dashboard groupings.
  let!(:fixed_expense_item) do
    build_item(factory: :monthly_expense, amount: -100_00)
  end
  let!(:fixed_revenue_item) do
    build_item(factory: :monthly_revenue, amount: 500_00)
  end
  let!(:variable_expense_item) do
    build_item(factory: :weekly_expense, amount: -50_00)
  end
  let!(:variable_revenue_item) do
    build_item(factory: :weekly_revenue, amount: 25_00)
  end

  around do |example|
    travel_to(Time.zone.local(2026, 7, 15, 12, 0, 0)) { example.run }
  end

  before { sign_in(user) }

  # Builds a budget item in the interval with a single "item_create" event so it
  # surfaces as an active detailed_item with a non-zero currently-budgeted
  # amount. (item_create is a non-rollover create event, so it counts toward
  # currently_budgeted rather than previously_budgeted.)
  def build_item(factory:, amount:)
    create(factory, interval:).tap do |item|
      item.category.update!(user_group:)
      create(:budget_item_event, :item_create,
        item:, user:, amount:, change_set:)
    end
  end

  it "renders the dashboard component" do
    get_dashboard

    expect(response).to have_http_status(:ok)
    expect_inertia.to render_component("budget/dashboard")
  end

  describe "items" do
    subject(:items) do
      get_dashboard
      inertia.props[:items]
    end

    it "groups each item under the correct collection" do
      expect(items[:fixedExpenses].pluck(:key)).to eq [ fixed_expense_item.key ]
      expect(items[:variableExpenses].pluck(:key))
        .to eq [ variable_expense_item.key ]
      expect(items[:fixedRevenues].pluck(:key)).to eq [ fixed_revenue_item.key ]
      expect(items[:variableRevenues].pluck(:key))
        .to eq [ variable_revenue_item.key ]
    end

    it "serializes an item with its full attribute set" do
      expect(items[:fixedExpenses].first).to eq(
        key: fixed_expense_item.key,
        budgetCategoryKey: fixed_expense_item.category.key,
        currentlyBudgetedPercentage: 100,
        iconClassName: "",
        maturityMonth: nil,
        maturityYear: nil,
        month: 7,
        name: fixed_expense_item.category.name,
        objectKey: "budget-item-#{fixed_expense_item.key}",
        previouslyBudgetedPercentage: 0,
        year: 2026,
        amount: { display: "-100.00", cents: -100_00 },
        currentlyBudgeted: { display: "-100.00", cents: -100_00 },
        isAccrual: false,
        isDeleted: false,
        isCleared: false,
        isDeletable: true,
        isExpense: true,
        isFixed: true,
        isMature: false,
        isPending: true,
        previouslyBudgeted: { display: "0.00", cents: 0 },
        remaining: { display: "-100.00", cents: -100_00 },
        transactionDetailTotal: { display: "0.00", cents: 0 },
        transactionDetails: [],
        upcomingMaturityMonth: nil
      )
    end
  end

  describe "discretionary" do
    subject(:discretionary) do
      get_dashboard
      inertia.props[:discretionary]
    end

    # remaining = sum of item remainings (-100 - 50 + 500 + 25 = 375).
    it "serializes the computed discretionary totals" do
      expect(discretionary).to eq(
        initialAmount: { display: "375.00", cents: 375_00 },
        overUnderBudget: { display: "0.00", cents: 0 },
        remaining: { display: "375.00", cents: 375_00 },
        transactionsTotal: { display: "0.00", cents: 0 }
      )
    end
  end

  describe "budgetMonth" do
    subject(:budget_month) do
      get_dashboard
      inertia.props[:budgetMonth]
    end

    it "serializes the month metadata and neighbor links" do
      expect(budget_month).to eq(
        month: 7,
        year: 2026,
        daysRemaining: 16,
        totalDays: 30,
        monthName: "July",
        firstDate: "July 1, 2026",
        lastDate: "July 30, 2026",
        isCurrent: true,
        isSetUp: true,
        setupRoute: "",
        nextMonth: {
          monthName: "August 2026",
          month: 8,
          year: 2026,
          href: "/budget/8/2026",
        },
        previousMonth: {
          monthName: "June 2026", month: 6, year: 2026, href: "/budget/6/2026",
        }
      )
    end
  end

  describe "pageData" do
    subject(:page_data) do
      get_dashboard
      inertia.props[:pageData]
    end

    it "serializes the page metadata" do
      expect(page_data[:metadata]).to eq(
        namespace: :budget,
        userKey: user.key,
        pageName: "budget/dashboard"
      )
    end

    context "when requested without month/year" do
      it "reports only the static route segment" do
        expect(page_data[:redirectSegments]).to eq [ :budget ]
      end
    end

    context "when requested for a specific month/year" do
      let(:path) { "/budget/#{interval.month}/#{interval.year}" }

      it "appends the month and year to the route segments" do
        expect(page_data[:redirectSegments]).to eq [ :budget, "7", "2026" ]
      end
    end
  end
end
