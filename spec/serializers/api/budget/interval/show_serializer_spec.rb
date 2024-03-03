require "rails_helper"

RSpec.describe API::Budget::Interval::ShowSerializer do
  describe "#days_remaining" do
    subject { described_class.new(user, interval) }

    let(:user) { create(:user) }
    let(:interval) do
      create(
        :budget_interval,
        user_group: user.group,
        start_date: Date.new(2022, 3, 1),
        end_date: Date.new(2022, 3, 31)
      )
    end

    context "when in the interval is in the past" do
      before { travel_to(Date.new(2022, 4, 20)) }

      it "returns zero" do
        expect(subject.days_remaining).to be_zero
      end
    end

    context "when in the interval is in the future" do
      before { travel_to(Date.new(2022, 1, 30)) }

      it "returns the total number of days" do
        expect(subject.days_remaining).to be 31
      end
    end

    context "when the interval is current" do
      before { travel_to(Date.new(2022, 3, 10)) }

      it "returns the difference + 1" do
        expect(subject.days_remaining).to be 22
      end
    end
  end

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

  describe "#categories" do
    subject { described_class.new(user, interval) }

    let(:user) { create(:user) }
    let(:interval) { create(:budget_interval, user_group: user.group) }
    let(:groceries) { create(:category, :expense, user_group: user.group) }
    let(:salary) { create(:category, :revenue, user_group: user.group) }
    let(:groceries_serializer) { instance_double(API::Budget::Interval::CategorySerializer) }
    let(:salary_serializer) { instance_double(API::Budget::Interval::CategorySerializer) }

    before do
      allow(API::Budget::Interval::CategorySerializer)
        .to receive(:new)
        .with(groceries)
        .and_return(groceries_serializer)
      allow(API::Budget::Interval::CategorySerializer)
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

    let(:user) { create(:user) }
    let(:interval) { create(:budget_interval, user_group: user.group) }

    it "returns the difference + 1" do
      expect(subject.total_days).to eq((interval.last_date - interval.first_date).to_i + 1)
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
