require "rails_helper"

RSpec.describe "DELETE /api/budget/category/:category_key" do
  subject do
    delete(api_budget_category_path(category_key), headers:)
  end

  context "when at least one related budget item exists" do
    include_context "with valid token"

    let(:icon) { create(:icon) }
    let(:category) do
      create(:category, :accrual, icon:, user_group: user.group)
    end
    let(:category_key) { category.key }

    before do
      create(:budget_item, category:)
    end

    it "updates the category, and returns a serialized category" do
      expect { subject }
        .to change { category.reload.archived? }
        .from(false)
        .to(true)
      expect(response).to have_http_status :accepted
      body = response.parsed_body.deep_symbolize_keys
      expect(body).to eq(
        budgetCategory: {
          key: category.key,
          archivedAt: category.archived_at.strftime("%F"),
          defaultAmount: category.default_amount,
          iconClassName: icon.class_name,
          isAccrual: category.accrual,
          isExpense: category.expense?,
          isMonthly: category.monthly?,
          isPerDiemEnabled: category.is_per_diem_enabled?,
          maturityIntervals: [],
          name: category.name,
          slug: category.slug,
        }
      )
    end
  end

  context "when no related budget item exists" do
    include_context "with valid token"

    let!(:category) { create(:category, :expense, user_group: user.group) }
    let(:category_key) { category.key }

    it "returns an unprocessable entity status, error messages" do
      expect { subject }
        .to change { Budget::Category.count }
        .by(-1)
      expect(response).to have_http_status :accepted
      body = response.parsed_body.deep_symbolize_keys
      expect(body)
        .to eq(budgetCategory: { deletedBudgetCategoryIds: [ category.id ] })
    end
  end

  context "when the controller fails to find the budget category by key" do
    include_context "with valid token"

    let(:params) { {} }

    it_behaves_like "endpoint requires budget category"
  end

  context "when passing an invalid token" do
    let(:params) { {} }
    let(:category_key) { KeyGenerator.call }

    it_behaves_like "a token authenticated endpoint"
  end
end
