require "rails_helper"

RSpec.describe "DELETE /api/account/:account_key/transactions/:key/:month/:year" do
  subject do
    delete(api_account_transaction_path(account_key, transaction_key),
           headers: headers)
  end

  context "when the account is not found" do
    let(:transaction_key) { SecureRandom.hex(6) }
    let(:account_key) { SecureRandom.hex(6) }

    include_context "with valid token"
    include_examples "endpoint requires account"
  end

  context "when passing an account key for an unrelated account" do
    include_context "with valid token"
    include_context "with an account belonging to a different user group"

    let(:account_key) { other_groups_account.key }
    let(:transaction_key) { SecureRandom.hex(6) }

    include_examples "endpoint requires account"
  end

  context "when the transaction is not found" do
    include_context "with valid token"
    include_examples "endpoint requires transaction entry"
  end

  context "when providing an invalid interval" do
    subject do
      delete(api_account_transaction_path(account_key, transaction_key, month, year),
             headers: headers)
    end

    let(:transaction_key) { SecureRandom.hex(6) }

    include_context "with valid token"
    include_examples "endpoint requires budget interval"
  end

  context "when deleting a transaction" do
    include_context "with valid token"

    let(:account) { FactoryBot.create(:account, user_group: user.group) }
    let(:account_key) { account.key }
    let!(:transaction) { FactoryBot.create(:transaction_entry, account: account) }
    let(:transaction_key) { transaction.key }

    it "deletes the transaction, returns accepted status and a response" do
      expect { subject }.to change { account.reload.transactions.count }.by(-1)
      expect(response).to have_http_status :accepted
      body = JSON.parse(response.body).deep_symbolize_keys
      expect(body).to eq(
        accounts: [{ key: account.key, balance: 0, balancePriorTo: 0 }],
        deletedTransactionKeys: [transaction.key],
        transactions: [],
      )
    end
  end

  context "when deleting a transfer" do
    include_context "with valid token"

    let(:account) { FactoryBot.create(:account, user_group: user.group) }
    let(:savings_account) { FactoryBot.create(:savings_account, user_group: user.group) }
    let(:transfer_result) do
      Forms::TransferForm.new(
        user: user,
        params: {
          amount: rand(100_00),
          from_account_key: account.key,
          to_account_key: savings_account.key,
        }
      ).call
    end
    let(:transaction_entry) { transfer_result.last[:transfer].to_transaction }
    let(:account_key) { transaction_entry.account.key }
    let(:transaction_key) { transaction_entry.key }

    it "does not delete the transaction" do
      subject
      expect(response).to have_http_status :unprocessable_entity
      body = JSON.parse(response.body).deep_symbolize_keys
      expect(body).to eq(
        transaction: {
          base: ["Cannot delete record because a dependent credit transfer exists"],
        },
      )
    end
  end

  describe "token authentication" do
    let(:account_key) { SecureRandom.hex(6) }
    let(:transaction_key) { SecureRandom.hex(6) }
    let(:month) { rand(1..12) }
    let(:year) { rand(2020..2039) }
    let(:params) { {} }

    it_behaves_like "a token authenticated endpoint"
  end
end
