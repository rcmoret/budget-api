require "rails_helper"

RSpec.describe "DELETE /api/accounts/transfer/:key/(:month)/(:year)" do
  subject do
    delete(api_accounts_transfer_path(transfer_key), headers: headers)
  end

  context "when deleting a transfer" do
    include_context "with valid token"

    let(:transfer_key) { SecureRandom.hex(6) }

    let!(:transfer) { create_transfer_for(user, key: transfer_key) }

    it "returns an accepted status" do
      expect { subject }
        .to change { Transaction::Entry.belonging_to(user).count }
        .by(-2)
        .and change { Transfer.belonging_to(user).count }
        .by(-1)
      expect(response).to have_http_status :accepted
      body = JSON.parse(response.body).deep_symbolize_keys
      expect(body[:accounts]).to eq(transfer.transaction_accounts.map do |account|
        { key: account.key, balance: 0, balancePriorTo: 0 }
      end)
      expect(body[:deletedTransactionKeys]).to match_array(transfer.transaction_keys)
    end
  end

  context "when the transfer is not found" do
    include_context "with valid token"

    let(:transfer_key) { SecureRandom.hex(6) }

    it "returns a not found status" do
      subject
      expect(response).to have_http_status :not_found
    end
  end

  describe "token authentication" do
    let(:transfer_key) { SecureRandom.hex(6) }
    let(:month) { rand(1..12) }
    let(:year) { rand(2020..2039) }
    let(:params) { {} }

    it_behaves_like "a token authenticated endpoint"
  end

  def create_transfer_for(user, **options)
    Forms::TransferForm.new(user: user, params: transfer_params(user, options)).then do |form|
      form.call => [:ok, { transfer: transfer }]

      transfer
    end
  end

  def transfer_params(user, options)
    to_account = options.fetch(:to_account) { FactoryBot.create(:account, user_group: user.group) }
    from_account = options.fetch(:from_account) { FactoryBot.create(:account, user_group: user.group) }

    {
      amount: options.fetch(:amount) { rand(100_00) },
      key: options.fetch(:key) { SecureRandom.hex(6) },
      from_account_key: from_account.key,
      to_account_key: to_account.key,
    }
  end
end
