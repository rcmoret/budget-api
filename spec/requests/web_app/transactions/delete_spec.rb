require "rails_helper"

RSpec.describe "WebApp::Transactions::DeleteController" do
  subject(:delete_transaction) do
    delete "/account/#{account.slug}/transaction/#{entry.key}",
      params: { redirect: { segments: redirect_segments } }
  end

  let(:user) { create(:user) }
  let(:account) { create(:account, user_group: user.group) }
  let(:entry) { create(:transaction_entry, account:) }
  let(:redirect_segments) { [] }

  before { sign_in(user) }

  it "destroys the transaction entry" do
    expect { delete_transaction }
      .to change { Transaction::Entry.exists?(entry.id) }
      .from(true)
      .to(false)
  end

  it "redirects to the dashboard when no specific redirect is resolved" do
    delete_transaction

    expect(response).to redirect_to(dashboard_path)
  end

  context "when the redirect targets the account's transactions" do
    let(:redirect_segments) { [ "account", account.slug, "transactions" ] }

    it "redirects there" do
      delete_transaction

      expect(response).to redirect_to(transactions_path(account.slug))
    end
  end

  context "when the transaction key does not exist for the account" do
    subject(:delete_transaction) do
      delete "/account/#{account.slug}/transaction/does-not-exist",
        params: { redirect: { segments: redirect_segments } }
    end

    it "redirects to the root path" do
      delete_transaction

      expect(response).to redirect_to(root_path)
    end
  end

  context "when the account slug does not belong to the user" do
    subject(:delete_transaction) do
      delete "/account/does-not-exist/transaction/#{entry.key}",
        params: { redirect: { segments: redirect_segments } }
    end

    it "does not destroy the transaction entry" do
      expect { delete_transaction }
        .not_to(change { Transaction::Entry.exists?(entry.id) })
    end

    it "redirects to the accounts index" do
      delete_transaction

      expect(response).to redirect_to(accounts_path)
    end
  end

  context "when the transaction is part of a transfer" do
    let(:other_account) { create(:account, user_group: user.group) }
    let(:entry) { create(:transaction_entry, :discretionary, account:) }
    let(:to_transaction) do
      create(:transaction_entry, :discretionary, account: other_account)
    end

    before do
      create(:transfer, from_transaction: entry, to_transaction:)
    end

    it "does not destroy the transaction entry" do
      expect { delete_transaction }
        .not_to(change { Transaction::Entry.exists?(entry.id) })
    end

    it "still redirects as though the delete succeeded" do
      delete_transaction

      expect(response).to redirect_to(dashboard_path)
    end
  end
end
