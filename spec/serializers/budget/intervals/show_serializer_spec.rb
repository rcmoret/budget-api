require "rails_helper"

RSpec.describe Budget::Intervals::ShowSerializer do
  describe "#days_remaining"

  describe "#discretionary" do
    subject { described_class.new(user, interval) }

    let(:user) { FactoryBot.create(:user) }
    let(:interval) { FactoryBot.create(:budget_interval, user_group: user.group) }
    let(:discretionary_serializer_double) do
      instance_double(Budget::Intervals::DiscretionarySerializer)
    end

    before do
      allow(Budget::Intervals::DiscretionarySerializer)
        .to receive(:new)
        .with(interval)
        .and_return(discretionary_serializer_double)
    end

    it "returns the discretionary serializer" do
      expect(subject.discretionary).to eq discretionary_serializer_double
    end
  end

  describe "#categories" do
    subject { described_class.new(user, interval) }

    let(:user) { FactoryBot.create(:user) }
    let(:interval) { FactoryBot.create(:budget_interval, user_group: user.group) }
    let(:groceries) { FactoryBot.create(:category, :expense, user_group: user.group) }
    let(:salary) { FactoryBot.create(:category, :revenue, user_group: user.group) }
    let(:groceries_serializer) { instance_double(Budget::Intervals::CategorySerializer) }
    let(:salary_serializer) { instance_double(Budget::Intervals::CategorySerializer) }

    before do
      allow(Budget::Intervals::CategorySerializer)
        .to receive(:new)
        .with(groceries)
        .and_return(groceries_serializer)
      allow(Budget::Intervals::CategorySerializer)
        .to receive(:new)
        .with(salary)
        .and_return(salary_serializer)
    end

    it "returns serialized cateories" do
      expect(subject.categories).to contain_exactly(groceries_serializer, salary_serializer)
    end
  end

  describe "#total_days" do
    subject { described_class.new(user, interval) }

    let(:user) { FactoryBot.create(:user) }
    let(:interval) { FactoryBot.create(:budget_interval, user_group: user.group) }

    it "returns the difference + 1" do
      expect(subject.total_days).to eq((interval.last_date - interval.first_date).to_i + 1)
    end
  end

  describe "#items" do
    subject { described_class.new(user, interval) }

    let(:user) { FactoryBot.create(:user) }
    let(:icon) { FactoryBot.create(:icon) }
    let(:category) do
      FactoryBot.create(:category, :expense, :accrual, user_group: user.group, icon: icon)
    end
    let(:interval) { FactoryBot.create(:budget_interval, month: 12, year: 2024) }
    let!(:budget_item) do
      FactoryBot.create(:budget_item, :expense, category: category, interval: interval)
    end
    let!(:create_event) do
      FactoryBot.create(:budget_item_event, :create_event, item: budget_item, amount: rand(-100_00..-100))
    end
    let!(:transaction_detail) { FactoryBot.create(:transaction_detail, budget_item: budget_item) }

    before { FactoryBot.create(:maturity_interval, interval: interval.next, category: category) }

    it "returns the items" do
      item = budget_item.decorated

      expect(subject.items.render).to eq(
        [
          {
            "amount" => create_event.amount,
            "budgetCategoryKey" => category.key,
            "difference" => item.difference,
            "events" => [
              {
                "amount" => create_event.amount,
                "createdAt" => create_event.created_at.strftime("%FT%TZ"),
                "data" => nil,
                "key" => create_event.key,
                "typeName" => create_event.type.name,
              },
            ],
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
            "transactionDetails" => [
              {
                "accountName" => transaction_detail.entry.account.name,
                "amount" => transaction_detail.amount,
                "clearanceDate" => transaction_detail.entry.clearance_date.strftime("%F"),
                "description" => transaction_detail.entry.description,
                "key" => transaction_detail.key,
                "transactionEntryKey" => transaction_detail.entry.key,
                "updatedAt" => transaction_detail.updated_at.strftime("%FT%TZ"),
              },
            ],
          },
        ]
      )
    end
  end
end
