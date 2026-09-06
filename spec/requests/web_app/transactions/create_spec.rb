require "rails_helper"

RSpec.describe "WebApp::Transactions::CreateController" do
  subject(:post_transaction) do
    post "/account/#{account.slug}/transaction",
      params: {
        transaction: transaction_params,
        redirect: { segments: redirect_segments },
      }
  end

  include_context "when there is a current interval and item"

  let(:user) { create(:user) }
  let(:account) { create(:account, user_group: user.group) }
  let(:redirect_segments) { [] }
  let(:transaction_key) { KeyGenerator.call }
  let(:detail_key) { KeyGenerator.call }
  let(:transaction_params) do
    {
      key: transaction_key,
      description: "Publix",
      clearance_date: nil,
      details_attributes: [
        { key: detail_key, amount: 100_00, budget_item_key: budget_item.key },
      ],
    }
  end

  before { sign_in(user) }

  def created_entry
    account.transactions.by_key(transaction_key)
  end

  it "creates a transaction entry for the account" do
    expect { post_transaction }.to change { account.transactions.count }.by(1)
  end

  it "persists the submitted attributes and detail" do
    post_transaction

    expect(created_entry.description).to eq("Publix")
    expect(created_entry.details.count).to eq(1)
    expect(created_entry.details.first).to have_attributes(
      key: detail_key,
      amount: 100_00,
      budget_item_id: budget_item.id
    )
  end

  it "redirects to the dashboard when no specific redirect is resolved" do
    post_transaction

    expect(response).to redirect_to(dashboard_path)
  end

  context "when the redirect targets the account's transactions" do
    let(:redirect_segments) { [ "account", account.slug, "transactions" ] }

    it "redirects there" do
      post_transaction

      expect(response).to redirect_to(transactions_path(account.slug))
    end
  end

  context "when the description is blank" do
    let(:transaction_params) do
      {
        key: transaction_key,
        description: "   ",
        details_attributes: [
          { key: detail_key, amount: 100_00, budget_item_key: budget_item.key },
        ],
      }
    end

    it "nullifies the description rather than storing whitespace" do
      post_transaction

      expect(created_entry.description).to be_nil
    end
  end

  context "when submitting multiple details" do
    let(:other_budget_item) do
      create(:budget_item, interval:, category: budget_category)
    end
    let(:transaction_params) do
      {
        key: transaction_key,
        description: "Publix",
        details_attributes: [
          { key: KeyGenerator.call, amount: 60_00,
            budget_item_key: budget_item.key, },
          { key: KeyGenerator.call, amount: 40_00,
            budget_item_key: other_budget_item.key, },
        ],
      }
    end

    it "creates a detail for each entry submitted" do
      post_transaction

      expect(created_entry.details.count).to eq(2)
    end
  end

  context "when no details are provided" do
    let(:transaction_params) do
      { key: transaction_key, description: "Publix", details_attributes: [] }
    end

    it "does not create a transaction entry" do
      expect { post_transaction }.not_to(change { Transaction::Entry.count })
    end

    it "renders the validation errors as json" do
      post_transaction

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to eq(
        "details" => [ "Must have at least one detail for this entry" ]
      )
    end
  end

  context "when the account slug does not belong to the user" do
    subject(:post_transaction) do
      post "/account/does-not-exist/transaction",
        params: {
          transaction: transaction_params,
          redirect: { segments: redirect_segments },
        }
    end

    it "does not create a transaction entry" do
      expect { post_transaction }.not_to(change { Transaction::Entry.count })
    end

    it "redirects to the accounts index" do
      post_transaction

      expect(response).to redirect_to(accounts_path)
    end
  end
end
