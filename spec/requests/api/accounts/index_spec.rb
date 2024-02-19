require "rails_helper"

RSpec.describe "GET /api/accounts" do
  subject { get(api_accounts_path, headers: headers) }

  context "when providing a valid token" do
    include_context "with valid token"
    include_context "with an account belonging to a different user group"

    let(:user) { create(:user) }
    let(:user_group) { user.user_group }
    let(:spend_account) { create(:account, user_group: user_group) }
    let(:transactions) do
      user_accounts.map do |user_account|
        create_list(:transaction_entry, (1..10).to_a.sample, account: user_account)
      end
    end
    let(:save_account) { create(:account, :non_cash_flow, user_group: user_group) }
    let(:archived_account) { create(:account, :archived, user_group: user_group) }
    let(:collection) do
      response.parsed_body.fetch("accounts").map(&:deep_symbolize_keys)
    end
    let(:user_accounts) { [spend_account, save_account, archived_account] }

    let!(:expected_collection) do
      user_accounts.map do |account|
        {
          key: account.key,
          name: account.name,
          slug: account.slug,
          priority: account.priority,
          isArchived: account.archived_at.present?,
          archivedAt: account.archived_at&.strftime("%F"),
          isCashFlow: account.cash_flow?,
          balance: account.balance,
        }
      end
    end

    it "includes a collection of accounts" do
      subject
      expect(response).to have_http_status(:ok)
      expect(collection).to match_array(expected_collection)
    end
  end

  it_behaves_like "a token authenticated endpoint"
end
