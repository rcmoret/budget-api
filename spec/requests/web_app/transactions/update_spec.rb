require "rails_helper"

RSpec.describe "WebApp::Transactions::UpdateController" do
  subject(:put_transaction) do
    put "/account/#{account.slug}/transaction/#{entry.key}",
      params: {
        transaction: transaction_params,
        redirect: { segments: redirect_segments },
      }
  end

  include_context "when there is a current interval and item"

  let(:user) { create(:user) }
  let(:account) { create(:account, user_group: user.group) }
  let(:entry) do
    create(:transaction_entry, account:,
      details_attributes: [
        { key: KeyGenerator.call, amount: 50_00,
          budget_item_id: budget_item.id, },
      ])
  end
  let(:detail) { entry.details.first }
  let(:redirect_segments) { [] }
  let(:transaction_params) do
    {
      key: entry.key,
      description: "Kroger",
      details_attributes: [
        { key: detail.key, amount: 75_00 },
      ],
    }
  end

  before { sign_in(user) }

  it "updates the transaction entry's attributes" do
    put_transaction

    expect(entry.reload.description).to eq("Kroger")
  end

  it "updates the targeted detail without creating a new one" do
    expect { put_transaction }.not_to(change { entry.details.count })
    expect(detail.reload.amount).to eq(75_00)
  end

  it "redirects to the dashboard when no specific redirect is resolved" do
    put_transaction

    expect(response).to redirect_to(dashboard_path)
  end

  context "when the request path includes the month and year" do
    subject(:put_transaction) do
      put "/account/#{account.slug}/transaction/#{entry.key}" \
          "/#{interval.month}/#{interval.year}",
        params: {
          transaction: transaction_params,
          redirect: { segments: redirect_segments },
        }
    end

    let(:redirect_segments) do
      [ "budget", interval.month.to_s, interval.year.to_s ]
    end

    it "still updates the transaction and redirects to that budget month" do
      put_transaction

      expect(entry.reload.description).to eq("Kroger")
      expect(response)
        .to redirect_to(budget_dashboard_path(interval.month, interval.year))
    end
  end

  context "when adding a new detail" do
    let(:other_budget_item) do
      create(:budget_item, interval:, category: budget_category)
    end
    let(:transaction_params) do
      {
        key: entry.key,
        details_attributes: [
          { key: detail.key, amount: 75_00 },
          { key: KeyGenerator.call, amount: 25_00,
            budget_item_key: other_budget_item.key, },
        ],
      }
    end

    it "creates the additional detail" do
      expect { put_transaction }.to change { entry.details.count }.by(1)
    end
  end

  context "when removing the only detail" do
    let(:transaction_params) do
      {
        key: entry.key,
        details_attributes: [
          { key: detail.key, _destroy: true },
        ],
      }
    end

    it "does not remove the detail" do
      expect { put_transaction }.not_to(change { entry.details.count })
    end

    it "renders the validation errors as json" do
      put_transaction

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to eq(
        "details" => [ "Must have at least one detail for this entry" ]
      )
    end
  end

  context "when switching the transaction to another account via account_key" do
    let(:other_account) { create(:account, user_group: user.group) }
    let(:transaction_params) do
      { key: entry.key, account_key: other_account.key, details_attributes: [] }
    end

    it "moves the transaction entry to the other account" do
      expect { put_transaction }
        .to change { entry.reload.account_id }
        .from(account.id)
        .to(other_account.id)
    end
  end

  context "when the transaction key does not exist for the account" do
    subject(:put_transaction) do
      put "/account/#{account.slug}/transaction/does-not-exist",
        params: {
          transaction: { key: "does-not-exist" },
          redirect: { segments: [] },
        }
    end

    it "redirects to the root path" do
      put_transaction

      expect(response).to redirect_to(root_path)
    end
  end

  context "when the account slug does not belong to the user" do
    subject(:put_transaction) do
      put "/account/does-not-exist/transaction/#{entry.key}",
        params: {
          transaction: transaction_params,
          redirect: { segments: redirect_segments },
        }
    end

    it "redirects to the accounts index" do
      put_transaction

      expect(response).to redirect_to(accounts_path)
    end
  end
end
