require "rails_helper"

RSpec.describe API::Budget::Interval::ShowSerializer do
  describe "#discretionary" do
    subject { described_class.new(user, interval) }

    let(:user) { create(:user) }
    let(:interval) { create(:budget_interval, user_group: user.group) }
    let(:discretionary_serializer_double) do
      instance_double(API::Budget::Interval::DiscretionarySerializer)
    end

    before do
      allow(API::Budget::Interval::DiscretionarySerializer)
        .to receive(:new)
        .with(interval)
        .and_return(discretionary_serializer_double)
    end

    it "returns the discretionary serializer" do
      expect(subject.discretionary).to eq discretionary_serializer_double
    end
  end

  describe "#items" do
    subject { described_class.new(user, interval) }

    let(:user) { create(:user) }
    let(:icon) { create(:icon) }
    let(:category) do
      create(:category, :expense, :accrual, user_group: user.group, icon: icon)
    end
    let(:interval) { create(:budget_interval, month: 12, year: 2024, user_group: user.group) }
    let!(:budget_item) do
      create(:budget_item, :expense, category: category, interval: interval)
    end
    let!(:create_event) do
      create(:budget_item_event, :create_event, item: budget_item, amount: rand(-100_00..-100))
    end
    let!(:transaction_detail) { create(:transaction_detail, budget_item: budget_item) }

    before { create(:maturity_interval, interval: interval.next, category: category) }

    it "returns the items" do
      item = budget_item.decorated

      expect(subject.items.render).to eq(
        [
          {
            "amount" => create_event.amount,
            "budgetCategoryKey" => category.key,
            "difference" => item.difference,
            "iconClassName" => icon.class_name,
            "isAccrual" => category.accrual?,
            "isDeletable" => budget_item.deletable?,
            "isExpense" => category.expense?,
            "isMonthly" => category.monthly,
            "isPerDiemEnabled" => category.per_diem_enabled?,
            "key" => item.key,
            "maturityMonth" => 1,
            "maturityYear" => 2025,
            "name" => category.name,
            "remaining" => item.remaining,
            "spent" => transaction_detail.amount,
            "transactionDetailCount" => 1,
          },
        ]
      )
    end
  end
end
