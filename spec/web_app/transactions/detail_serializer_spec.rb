require "rails_helper"

RSpec.describe WebApp::Transactions::DetailSerializer do
  subject(:serialized) { described_class.new(detail).to_h }

  context "when the detail has a budget item" do
    let(:interval) { create(:budget_interval, month: 3, year: 2026) }
    let(:budget_item) { create(:monthly_expense, interval:) }
    let(:detail) { create(:transaction_detail, budget_item:) }

    it "links to the item's category page for its month" do
      expect(serialized["budgetItemHref"]).to eq(
        "/budget/3/2026/items/#{budget_item.category.slug}"
      )
    end
  end

  context "when the detail has no budget item" do
    let(:detail) { create(:transaction_detail, :null_budget_item) }

    it "has no href" do
      expect(serialized["budgetItemHref"]).to be_nil
    end
  end
end
