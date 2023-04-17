require "rails_helper"

RSpec.describe Accounts::BudgetItemSerializer do
  describe "#render" do
    subject { described_class.new(item: budget_item.decorated, maturity_interval: date) }

    let(:user_group) { FactoryBot.create(:user_group) }
    let(:icon) { FactoryBot.create(:icon) }
    let(:category) { FactoryBot.create(:category, icon: icon, user_group: user_group) }
    let(:interval) { FactoryBot.create(:budget_interval, user_group: user_group) }
    let(:budget_item) do
      FactoryBot.create(:budget_item, category: category, interval: interval, user_group: user_group)
    end
    let(:decorated) { budget_item.decorated }
    let(:date) { Date.new(2022, 1, 1) }

    it "renders the correct serialized data" do
      expect(subject.render).to eq(
        "key" => budget_item.key,
        "name" => category.name,
        "amount" => decorated.amount,
        "iconClassName" => icon.class_name,
        "maturityMonth" => date.month,
        "maturityYear" => date.year,
        "isAccrual" => category.accrual?,
        "isDeletable" => decorated.deletable?,
        "isExpense" => category.expense?,
        "isMonthly" => category.monthly?,
        "remaining" => decorated.remaining,
      )
    end
  end
end
