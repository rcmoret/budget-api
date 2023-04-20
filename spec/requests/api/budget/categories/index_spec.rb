require "rails_helper"

RSpec.describe "GET /api/budget/categories" do
  subject { get(api_budget_categories_path, headers: headers) }

  context "when passing a valid token" do
    include_context "with valid token"
    include_context "with a budget category belonging to a different user group"

    let(:interval) { FactoryBot.create(:budget_interval, user_group: user.group) }
    let(:icon) { FactoryBot.create(:icon) }

    context "when the category is non-accrual" do
      let!(:grocery) { FactoryBot.create(:category, :weekly, icon: icon, user_group: user.group) }

      before { subject }

      it "returns the budget categories for the current user" do
        expect(response).to have_http_status :ok
        body = JSON.parse(response.body).deep_symbolize_keys
        expect(body).to eq(
          budgetCategories: [
            {
              key: grocery.key,
              archivedAt: nil,
              defaultAmount: grocery.default_amount,
              iconClassName: grocery.icon_class_name,
              isAccrual: grocery.accrual?,
              isExpense: grocery.expense?,
              isMonthly: grocery.monthly?,
              isPerDiemEnabled: grocery.per_diem_enabled?,
              name: grocery.name,
              slug: grocery.slug,
            },
          ]
        )
      end
    end

    context "when the category is accrual" do
      let(:holiday_fund) { FactoryBot.create(:category, :accrual, user_group: user.group) }
      let(:next_years_interval) do
        FactoryBot.create(
          :budget_interval,
          user_group: user.group,
          month: interval.month,
          year: (interval.year + 1)
        )
      end

      before do
        FactoryBot.create(:maturity_interval, interval: interval, category: holiday_fund)
        FactoryBot.create(:maturity_interval, interval: next_years_interval, category: holiday_fund)
        subject
      end

      it "returns the budget categories for the current user" do
        expect(response).to have_http_status :ok
        body = JSON.parse(response.body).deep_symbolize_keys
        expect(body[:budgetCategories].first).to include(
          isAccrual: true,
          maturityIntervals: [
            { month: interval.month, year: interval.year },
            { month: interval.month, year: next_years_interval.year },
          ]
        )
      end
    end

    context "when the category is archived" do
      let!(:defunkt_category) { FactoryBot.create(:category, :archived, user_group: user.group) }

      it "returns the budget categories for the current user" do
        subject
        expect(response).to have_http_status :ok
        body = JSON.parse(response.body).deep_symbolize_keys
        expect(body[:budgetCategories].first).to include(
          archivedAt: defunkt_category.archived_at.strftime("%F")
        )
      end
    end

    it_behaves_like "a token authenticated endpoint"
  end
end
