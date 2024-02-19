require "rails_helper"

RSpec.describe Budget::Intervals::CategorySerializer do
  describe "#render" do
    subject { described_class.new(budget_category) }

    let(:budget_category) { create(:category) }

    it "returns a hash of attributes" do
      expect(subject.render).to eq(
        "key" => budget_category.key,
        "slug" => budget_category.slug,
        "name" => budget_category.name,
        "defaultAmount" => budget_category.default_amount,
        "isAccrual" => budget_category.accrual?,
        "isExpense" => budget_category.expense?,
        "isMonthly" => budget_category.monthly?,
      )
    end
  end
end
