require "rails_helper"

RSpec.describe "POST /api/accounts/transfers" do
  subject do
    post(api_accounts_transfers_path(month, year),
         headers: headers,
         params: params)
  end

  shared_context "when user has budget interval" do
    let(:interval) { FactoryBot.create(:budget_interval, user_group: user.group) }
    let(:month) { interval.month }
    let(:year) { interval.year }
  end

  shared_examples "creating a valid transfer" do
    it "creates two transactions" do
      expect { subject }
        .to change { from_account.reload.transactions.count }.by(+1)
        .and change { from_account.reload.balance }.by(-amount)
        .and change { to_account.reload.transactions.count }.by(+1)
        .and change { to_account.reload.balance }.by(+amount)
      expect(response).to have_http_status :created
      body = JSON.parse(response.body).deep_symbolize_keys
      # binding.pry
      expect(body[:accounts]).to contain_exactly(
        { key: from_account.key, balance: -amount, balancePriorTo: -amount },
        { key: to_account.key, balance: amount, balancePriorTo: amount },
      )
      expect(body[:transactions].size).to be 2
    end
  end

  context "when providing to and from account" do
    include_context "with valid token"
    include_context "when user has budget interval"

    let(:from_account) { FactoryBot.create(:account, user_group: user.group) }
    let(:to_account) { FactoryBot.create(:account, user_group: user.group) }

    context "when the amount is positive" do
      let(:amount) { rand(100_00) }
      let(:params) do
        {
          transfer: {
            amount: amount,
            from_account_key: from_account.key,
            to_account_key: to_account.key,
          },
        }
      end

      include_examples "creating a valid transfer"
    end

    context "when the amount is negative" do
      let(:amount) { rand(100_00) }
      let(:params) do
        {
          transfer: {
            amount: -amount,
            from_account_key: from_account.key,
            to_account_key: to_account.key,
          },
        }
      end

      include_examples "creating a valid transfer"
    end
  end

  context "when providing to account but not from account" do
    include_context "with valid token"
    include_context "when user has budget interval"

    let(:to_account) { FactoryBot.create(:account, user_group: user.group) }
    let(:params) do
      {
        transfer: {
          amount: rand(100_00),
          from_account_key: SecureRandom.hex(6),
          to_account_key: to_account.key,
        },
      }
    end

    it "response with a not found status, an error message" do
      subject
      expect(response).to have_http_status :not_found
      body = JSON.parse(response.body).deep_symbolize_keys
      expect(body).to eq(from_account: ["can't be blank"])
    end
  end

  context "when providing from account but not to account" do
    include_context "with valid token"
    include_context "when user has budget interval"

    let(:from_account) { FactoryBot.create(:account, user_group: user.group) }
    let(:params) do
      {
        transfer: {
          amount: rand(100_00),
          from_account_key: from_account.key,
          to_account_key: SecureRandom.hex(6),
        },
      }
    end

    it "response with a not found status, an error message" do
      subject
      expect(response).to have_http_status :not_found
      body = JSON.parse(response.body).deep_symbolize_keys
      expect(body).to eq(to_account: ["can't be blank"])
    end
  end

  context "when providing from and to account but not an amount" do
    include_context "with valid token"
    include_context "when user has budget interval"

    let(:from_account) { FactoryBot.create(:account, user_group: user.group) }
    let(:to_account) { FactoryBot.create(:account, user_group: user.group) }
    let(:params) do
      {
        transfer: {
          amount: "",
          from_account_key: from_account.key,
          to_account_key: to_account.key,
        },
      }
    end

    it "response with a not found status, an error message" do
      subject
      expect(response).to have_http_status :unprocessable_entity
      body = JSON.parse(response.body).deep_symbolize_keys
      expect(body).to eq(amount: ["must be greater than 0"])
    end
  end

  context "when providing an invalid budget interval" do
    include_context "with valid token"

    let(:params) do
      {
        transfer: {
          amount: rand(100_00),
          from_account_key: SecureRandom.hex(6),
          to_account_key: SecureRandom.hex(6),
        },
      }
    end

    include_context "endpoint requires budget interval"
  end

  describe "token authentication" do
    let(:account_key) { SecureRandom.hex(6) }
    let(:month) { rand(1..12) }
    let(:year) { rand(2020..2039) }
    let(:params) { {} }

    it_behaves_like "a token authenticated endpoint"
  end
end
