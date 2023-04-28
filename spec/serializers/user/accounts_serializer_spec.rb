require "rails_helper"

RSpec.describe User::AccountsSerializer do
  describe "#accounts" do
    let(:user) { FactoryBot.create(:user) }
    let(:checking_account) { FactoryBot.create(:account, user_group: user.group) }
    let(:savings_account) { FactoryBot.create(:savings_account, user_group: user.group) }
    let!(:empty_account) { FactoryBot.create(:account, user_group: user.group) }

    before do
      FactoryBot.create_list(:transaction_entry, 10, account: checking_account)
      FactoryBot.create_list(:transaction_entry, 10, account: savings_account)
      FactoryBot.create(:account)
    end

    it "calls the user account serializer with each of the user group accounts" do
      expect(User::AccountSerializer)
        .to receive(:new)
        .with({ account: checking_account, balance: checking_account.balance })
      expect(User::AccountSerializer)
        .to receive(:new)
        .with({ account: savings_account, balance: savings_account.balance })
      expect(User::AccountSerializer)
        .to receive(:new)
        .with({ account: empty_account, balance: 0 })
      described_class.new(user).accounts
    end
  end
end