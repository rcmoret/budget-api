require "rails_helper"

RSpec.describe Accounts::ShowSerializer do
  describe "delegated methods" do
    subject { described_class.new(account: account) }

    let(:account) { build(:account) }

    it "delegates most methods" do
      expect(subject.key).to eq account.key
      expect(subject.slug).to eq account.slug
      expect(subject.name).to eq account.name
      expect(subject.priority).to eq account.priority
      expect(subject.is_cash_flow).to eq account.cash_flow?
    end
  end

  describe "#balance" do
    context "when balance is provided during initialization" do
      subject { described_class.new(account: account, balance: balance) }

      let(:account) { instance_double(Account) }
      let(:balance) { rand(-100_00..100_00) }

      it "returns the provided balance" do
        expect(account).not_to receive(:balance)
        expect(subject.balance).to eq balance
      end
    end

    context "when balance is not provided during initialization" do
      subject { described_class.new(account: account) }

      let(:account) { instance_double(Account, balance: balance) }
      let(:balance) { rand(-100_00..100_00) }

      it "calls balance on the account and returns that" do
        expect(account).to receive(:balance)
        expect(subject.balance).to eq balance
      end
    end
  end

  describe "#archived_at and #is_archived" do
    subject { described_class.new(account: account) }

    context "when the account is active" do
      let(:account) { build(:account) }

      it "returns nil and false" do
        expect(subject.archived_at).to be_nil
        expect(subject.is_archived).to be false
      end
    end

    context "when the account is archived" do
      let(:account) { build(:account, :archived) }

      it "returns nil and false" do
        expect(subject.render["archivedAt"]).to eq account.archived_at.strftime("%F")
        expect(subject.is_archived).to be true
      end
    end
  end
end
