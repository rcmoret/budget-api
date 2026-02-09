require "rails_helper"

RSpec.describe WebApp::Accounts::IndexSerializer do
  describe "#accounts" do
    let(:user) { create(:user) }
    let(:checking_account) { create(:account, user_group: user.group) }
    let(:savings_account) { create(:savings_account, user_group: user.group) }
    let!(:empty_account) { create(:account, user_group: user.group) }

    before do
      create_list(:transaction_entry, 10, account: checking_account)
      create_list(:transaction_entry, 10, account: savings_account)
      create(:account)
    end

    it "calls the user account serializer " \
       "with each of the user group accounts" do
      expect(WebApp::Accounts::ShowSerializer)
        .to receive(:new)
        .with({ account: checking_account, balance: checking_account.balance })
      expect(WebApp::Accounts::ShowSerializer)
        .to receive(:new)
        .with({ account: savings_account, balance: savings_account.balance })
      expect(WebApp::Accounts::ShowSerializer)
        .to receive(:new)
        .with({ account: empty_account, balance: 0 })
      described_class.new(user.accounts).accounts
    end
  end
end
