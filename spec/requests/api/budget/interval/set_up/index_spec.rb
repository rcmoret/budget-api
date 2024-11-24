require "rails_helper"

RSpec.describe "GET /api/budget/intervals/set_up/:month/:year" do
  subject do
    get(
      api_budget_interval_set_up_path(month, year),
      headers: headers
    )
  end

  context "when trying to set up a previously set up interval" do
    include_context "with valid token"

    let(:interval) { create(:budget_interval, :set_up, user_group: user.group) }
    let(:month) { interval.month }
    let(:year) { interval.year }

    it "returns a bad request" do
      subject
      expect(response).to have_http_status :bad_request
      expect(response.parsed_body).to eq({ "budgetInterval" => "has been set up" })
    end
  end

  context "when setting up an interval" do
    include_context "with valid token"
    let(:user) { create(:user) }
    let(:current_interval) { create(:budget_interval, user_group: user.group) }
    let(:upcoming_interval) { current_interval.next }
    let(:further_upcoming_interval) { upcoming_interval.next.next }
    let(:accrual_category) { create_category(user, :monthly, :accrual) }
    let(:day_to_day_category) { create_category(user, :expense, :weekly) }
    let(:monthly_category) { create_category(user, :revenue, :monthly) }
    let(:accrual_item) { create(:budget_item, interval: current_interval, category: accrual_category) }
    let(:day_to_day_item) { create(:budget_item, interval: current_interval, category: day_to_day_category) }
    let(:day_to_day_upcoming_item) do
      create(:budget_item, interval: upcoming_interval, category: day_to_day_category)
    end
    let(:monthly_item) do
      create(:budget_item, interval: current_interval, category: monthly_category)
    end
    let(:monthly_upcoming_item) do
      create(:budget_item, interval: upcoming_interval, category: monthly_category)
    end
    let(:month) { upcoming_interval.month }
    let(:year) { upcoming_interval.year }
    let(:body) { JSON.parse.call(response.body).deep_symbolize_keys }
    let(:categories_data) { body.dig(:data, :budgetCategories) }
    let(:expected_category_keys) do
      %i[key name slug iconClassName isAccrual isExpense isMonthly events defaultAmount]
    end
    let(:expected_accrual_category_keys) { expected_category_keys + [:upcomingMaturityIntervals] }

    before do
      create(:maturity_interval, category: accrual_category, interval: current_interval.prev)
      create(:maturity_interval, category: accrual_category, interval: upcoming_interval)
      create(:maturity_interval, category: accrual_category, interval: further_upcoming_interval)
      [day_to_day_item, day_to_day_upcoming_item, accrual_item, monthly_item, monthly_upcoming_item]
    end

    it "returns data" do
      subject
      expect(response).to have_http_status :ok
      body = response.parsed_body.deep_symbolize_keys
      expect(body[:data]).to include(
        firstDate: upcoming_interval.first_date,
        lastDate: upcoming_interval.last_date,
      )
      expect(body.dig(:data, :categories).size).to be 3
      expect(body.dig(:data, :categories, 0).keys).to match_array(expected_accrual_category_keys)
      expect(body.dig(:data, :categories, 1).keys).to match_array(expected_category_keys)
      expect(body.dig(:data, :categories, 2).keys).to match_array(expected_category_keys)
      expect(body.dig(:data, :categories, 0)).to include(
        key: accrual_category.key,
        name: accrual_category.name,
        slug: accrual_category.slug,
        iconClassName: accrual_category.icon_class_name,
        isAccrual: true,
        isExpense: true,
        isMonthly: true,
        upcomingMaturityIntervals: [
          { month: upcoming_interval.month, year: upcoming_interval.year },
          { month: further_upcoming_interval.month, year: further_upcoming_interval.year },
        ],
      )
      expect(body.dig(:data, :categories, 1)).to include(
        key: day_to_day_category.key,
        name: day_to_day_category.name,
        slug: day_to_day_category.slug,
        iconClassName: day_to_day_category.icon_class_name,
        isAccrual: false,
        isExpense: true,
        isMonthly: false,
      )
      expect(body.dig(:data, :categories, 2)).to include(
        key: monthly_category.key,
        name: monthly_category.name,
        slug: monthly_category.slug,
        iconClassName: monthly_category.icon_class_name,
        isAccrual: false,
        isExpense: false,
        isMonthly: true,
      )
      expect(body.dig(:data, :categories, 0, :events).size).to be 1
      expect(body.dig(:data, :categories, 0, :events, 0)).to include(
        amount: 0,
        budgeted: accrual_item.amount,
        spent: accrual_item.spent,
        eventType: "setup_item_create",
        data: { referencedFrom: "budget item: #{accrual_item.key}" },
      )
      expect(body.dig(:data, :categories, 1, :events).size).to be 1
      expect(body.dig(:data, :categories, 1, :events, 0)).to include(
        amount: day_to_day_upcoming_item.amount,
        budgetItemKey: day_to_day_upcoming_item.key,
        budgeted: day_to_day_upcoming_item.amount,
        data: {},
        eventType: "setup_item_adjust",
        spent: day_to_day_upcoming_item.spent
      )
      expect(body.dig(:data, :categories, 2, :events).size).to be 2
    end
  end

  context "when passing an invalid month / year combination" do
    include_context "with valid token"

    it_behaves_like "endpoint requires budget interval"
  end

  context "when passing an invalid token" do
    let(:month) { rand(1..12) }
    let(:year) { rand(2020..2030) }

    it_behaves_like "a token authenticated endpoint"
  end

  def create_category(user, *traits, **optional_attributes)
    create(:category, *traits, user_group: user.group, **optional_attributes)
  end
end
