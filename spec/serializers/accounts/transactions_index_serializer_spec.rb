require "rails_helper"

RSpec.describe Accounts::TransactionsIndexSerializer do
  describe "delegated methods" do
    subject { described_class.new(account: account, interval: interval) }

    let(:user_group) { FactoryBot.create(:user_group) }
    let(:account) { FactoryBot.create(:account, :archived, user_group: user_group) }
    let(:interval) { FactoryBot.build(:budget_interval, user_group: user_group) }

    it "delegates methods to account" do
      expect(subject.key).to eq account.key
      expect(subject.name).to eq account.name
      expect(subject.slug).to eq account.slug
      expect(subject.priority).to eq account.priority
      expect(subject.balance).to eq account.balance
      expect(subject.is_cash_flow).to eq account.cash_flow?
    end
  end

  describe "archive related methods" do
    subject { described_class.new(account: account, interval: interval) }

    let(:user_group) { FactoryBot.create(:user_group) }
    let(:account) { FactoryBot.create(:account, :archived, user_group: user_group) }
    let(:interval) { FactoryBot.build(:budget_interval, user_group: user_group) }

    it "decorates the archived info" do
      expect(subject.is_archived).to eq account.archived_at.present?
      expect(subject.render["archivedAt"]).to eq account.archived_at.strftime("%F")
    end
  end

  describe "#transactions" do
    subject { described_class.new(account: account, interval: interval) }

    let(:user_group) { FactoryBot.create(:user_group) }
    let(:account) { FactoryBot.create(:account, user_group: user_group) }

    let!(:interval_transaction) do
      FactoryBot.create(:transaction_entry, account: account, clearance_date: interval.date_range.to_a.sample)
    end

    before do
      FactoryBot.create(:transaction_entry, :pending, account: account)
    end

    context "when the interval is current" do
      let(:interval) { FactoryBot.create(:budget_interval, :current, user_group: user_group) }

      it "includes pending transactions" do
        expect(subject.transactions.size).to be 2
        expect(subject.transactions.map(&:clearance_date))
          .to contain_exactly(nil, interval_transaction.clearance_date)
      end
    end

    context "when the interval is past" do
      let(:interval) { FactoryBot.create(:budget_interval, :past, user_group: user_group) }

      it "does not inlcude pending transactions" do
        expect(subject.transactions.size).to be 1
        expect(subject.transactions.map(&:clearance_date)).to contain_exactly(interval_transaction.clearance_date)
      end
    end
  end

  describe "#balance_prior_to" do
    subject { described_class.new(account: account, interval: interval) }

    let(:user_group) { FactoryBot.create(:user_group) }
    let(:account) { FactoryBot.create(:account, user_group: user_group) }
    let!(:entries) do
      FactoryBot.create_list(:transaction_entry, 10, account: account, clearance_date: (interval.first_date - 1.day))
    end
    let!(:pending_entries) do
      FactoryBot.create_list(:transaction_entry, 10, :pending, account: account)
    end

    before do
      FactoryBot.create_list(:transaction_entry, 10, account: account, clearance_date: interval.date_range.to_a.sample)
    end

    context "when the interval is current" do
      let(:interval) { FactoryBot.build(:budget_interval, :current, user_group: user_group) }

      it "returns the sum of the prior entries" do
        expect(subject.balance_prior_to).to eq entries.sum(&:total)
      end
    end

    context "when the interval is in the past" do
      let(:interval) { FactoryBot.build(:budget_interval, :past, user_group: user_group) }

      it "returns the sum of the prior entries" do
        expect(subject.balance_prior_to).to eq entries.sum(&:total)
      end
    end

    context "when the interval is in the future" do
      let(:interval) { FactoryBot.build(:budget_interval, :future, user_group: user_group) }

      it "returns the sum of the prior entries plus the pending entries" do
        expect(subject.balance_prior_to).to eq entries.sum(&:total) + pending_entries.sum(&:total)
      end
    end
  end

  describe "#items" do
    subject { described_class.new(account: account, interval: interval) }

    let(:user_group) { FactoryBot.create(:user_group) }
    let(:account) do
      FactoryBot.create(:account, user_group: user_group)
    end
    let(:interval) { FactoryBot.create(:budget_interval, :current, user_group: user_group) }
    let(:accrual_category) { FactoryBot.create(:category, :accrual, :with_icon, user_group: user_group) }
    let(:category) { FactoryBot.create(:category, :with_icon, :expense, user_group: user_group) }
    let!(:accrual_item) do
      FactoryBot.create(:budget_item, interval: interval, category: accrual_category).tap do |item|
        FactoryBot.create(:budget_item_event, :create_event, item: item, amount: rand(-100_00..-100))
      end.decorated
    end
    let!(:expense_item) do
      FactoryBot.create(:budget_item, interval: interval, category: category).tap do |item|
        FactoryBot.create(:budget_item_event, :create_event, item: item, amount: rand(-100_00..-100))
      end.decorated
    end

    before do
      FactoryBot.create(:maturity_interval, category: accrual_category, interval: interval.next)
    end

    it "returns serialized items" do
      expect(subject.budget.items.render.map(&:symbolize_keys)).to contain_exactly(
        {
          key: expense_item.key,
          name: category.name,
          amount: expense_item.amount,
          iconClassName: category.icon_class_name,
          maturityMonth: nil,
          maturityYear: nil,
          remaining: expense_item.remaining,
          isAccrual: false,
          isMonthly: category.monthly,
          isDeletable: expense_item.deletable?,
          isExpense: category.expense?,
        },
        {
          key: accrual_item.key,
          name: accrual_category.name,
          amount: accrual_item.amount,
          iconClassName: accrual_category.icon_class_name,
          maturityMonth: interval.next.month,
          maturityYear: interval.next.year,
          remaining: accrual_item.remaining,
          isAccrual: true,
          isMonthly: accrual_category.monthly,
          isDeletable: accrual_item.deletable?,
          isExpense: accrual_category.expense?,
        },
      )
    end
  end
end
