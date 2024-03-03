require "rails_helper"

RSpec.describe API::Accounts::Transactions::BudgetSerializer do
  describe "delegated methods" do
    subject { described_class.new(interval) }

    let(:user) { create(:user) }
    let(:interval) { create(:budget_interval, user_group: user.group) }

    specify do
      expect(subject.month).to eq interval.month
      expect(subject.year).to eq interval.year
      expect(subject.first_date).to eq interval.first_date.strftime("%F")
      expect(subject.last_date).to eq interval.last_date.strftime("%F")
      expect(subject.is_current).to eq interval.current?
    end
  end

  describe "#days_remaining" do
    subject { described_class.new(interval) }

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

  describe "#total_days" do
    subject { described_class.new(interval) }

    let(:user) { create(:user) }
    let(:interval) { create(:budget_interval, user_group: user.group) }

    it "returns the difference + 1" do
      expect(subject.total_days).to eq((interval.last_date - interval.first_date).to_i + 1)
    end
  end

  describe "#items" do
    subject { described_class.new(interval) }

    let(:user) { FactoryBot.create(:user) }
    let(:icon) { FactoryBot.create(:icon) }
    let(:category) do
      FactoryBot.create(:category, :expense, :accrual, user_group: user.group, icon: icon)
    end
    let(:interval) { FactoryBot.create(:budget_interval, month: 12, year: 2024, user_group: user.group) }
    let!(:budget_item) do
      FactoryBot.create(:budget_item, :expense, category: category, interval: interval)
    end
    let!(:create_event) do
      FactoryBot.create(:budget_item_event, :create_event, item: budget_item, amount: rand(-100_00..-100))
    end

    before { FactoryBot.create(:maturity_interval, interval: interval.next, category: category) }

    it "returns the items" do
      item = budget_item.decorated

      expect(subject.items.render).to eq(
        [
          {
            "amount" => create_event.amount,
            "iconClassName" => icon.class_name,
            "isAccrual" => category.accrual?,
            "isDeletable" => budget_item.deletable?,
            "isExpense" => category.expense?,
            "isMonthly" => category.monthly,
            "key" => item.key,
            "maturityMonth" => 1,
            "maturityYear" => 2025,
            "name" => category.name,
            "remaining" => create_event.amount,
          },
        ]
      )
    end
  end
end
