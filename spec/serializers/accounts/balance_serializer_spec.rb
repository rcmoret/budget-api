require "rails_helper"

RSpec.describe Accounts::BalanceSerializer do
  describe "#key" do
    subject { described_class.new(account, interval: interval) }

    let(:user_group) { FactoryBot.create(:user_group) }
    let(:account) { FactoryBot.create(:account, user_group: user_group) }
    let(:interval) { FactoryBot.create(:budget_interval, user_group: user_group) }

    it "returns the account's key" do
      expect(subject.key).to eq account.key
    end
  end

  describe "#balance" do
    subject { described_class.new(account, interval: interval) }

    include_context "with transactions belonging to another user group"

    let(:user_group) { FactoryBot.create(:user_group) }
    let(:account) { FactoryBot.create(:account, user_group: user_group) }
    let(:interval) { FactoryBot.create(:budget_interval, user_group: user_group) }

    before { FactoryBot.create_list(:transaction_entry, 10, account: account) }

    it "returns the sum of all transactions" do
      expect(subject.balance).to eq account.transactions.sum(&:total)
    end
  end

  describe "#balance_prior_to" do
    subject { described_class.new(account, interval: interval) }

    include_context "with transactions belonging to another user group"

    let(:user_group) { FactoryBot.create(:user_group) }
    let(:account) { FactoryBot.create(:account, user_group: user_group) }
    let(:clearance_date) { interval.prev.date_range.to_a.sample }

    let!(:cleared_transactions) do
      FactoryBot.create_list(:transaction_entry, 10, account: account, clearance_date: clearance_date)
    end
    let!(:pending_transactions) do
      FactoryBot.create_list(:transaction_entry, 10, :pending, account: account)
    end

    context "when the budget interval is current" do
      let(:interval) { FactoryBot.create(:budget_interval, :current, user_group: user_group) }

      it "returns the sum of cleared transactions prior to the beginning of the interval" do
        expect(subject.balance_prior_to).to eq cleared_transactions.sum(&:total)
      end
    end

    context "when the budget interval is in the future" do
      let(:interval) { FactoryBot.create(:budget_interval, :future, user_group: user_group) }

      it "returns the sum of cleared and pending transactions prior to the beginning of the interval" do
        expect(subject.balance_prior_to).to eq [*cleared_transactions, *pending_transactions].sum(&:total)
      end
    end
  end
end
