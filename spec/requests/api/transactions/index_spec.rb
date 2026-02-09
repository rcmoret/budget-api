require "rails_helper"

RSpec.describe "GET /api/accounts/:account_key/transactions/:month/:year" do
  context "when passing valid month, year combination" do
    subject do
      get(api_account_transactions_path(account_key, month, year),
        headers:)
    end

    include_context "with valid token"
    let(:user) { create(:user) }
    let(:account) { create(:account, user_group: user.user_group) }
    let(:account_key) { account.key }
    let(:interval) { create(:budget_interval) }
    let(:month) { interval.month }
    let(:year) { interval.year }
    let(:date_range) { interval.date_range.to_a }
    let(:previous_transactions) do
      create_list(
        :transaction_entry,
        10,
        account:,
        clearance_date: interval.prev.date_range.to_a.sample,
      )
    end
    let(:current_transactions) do
      create_list(
        :transaction_entry,
        10,
        account:,
        clearance_date: interval.date_range.to_a.sample,
      )
    end
    let(:future_transactions) do
      create_list(
        :transaction_entry,
        10,
        account:,
        clearance_date: interval.next.date_range.to_a.sample,
      )
    end
    let(:account_transactions) do
      [ *current_transactions, *previous_transactions, *future_transactions ]
    end

    before do
      account_transactions
      subject
    end

    it "returns a collection of transaction entries" do
      expect(response).to have_http_status :ok
      body = response.parsed_body.deep_symbolize_keys
      expect(body).to have_key(:account)
      expect(body.dig(:account, :transactions).size).to be 10
    end

    it "returns the account information including balance" do
      body = response.parsed_body.deep_symbolize_keys
      expect(body[:account][:balance])
        .to be account_transactions.map(&:total).sum
    end

    it "includes a balance prior to attribute" do
      subject
      body = response.parsed_body.deep_symbolize_keys
      expect(body[:account][:balancePriorTo])
        .to be previous_transactions.map(&:total).sum
    end
  end

  context "when not passing a month and year" do
    subject do
      get(api_account_transactions_path(account_key), headers:)
    end

    include_context "with valid token"
    let(:user) { create(:user) }
    let(:account) { create(:account, user_group: user.user_group) }
    let(:account_key) { account.key }
    let(:interval) { Budget::Interval.belonging_to(user).current }
    let(:previous_transactions) do
      create_list(
        :transaction_entry,
        10,
        account:,
        clearance_date: interval.prev.date_range.to_a.sample,
      )
    end
    let(:current_transactions) do
      create_list(
        :transaction_entry,
        10,
        account:,
        clearance_date: interval.date_range.to_a.sample,
      )
    end
    let(:future_transactions) do
      create_list(
        :transaction_entry,
        10,
        account:,
        clearance_date: interval.next.date_range.to_a.sample,
      )
    end
    let(:account_transactions) do
      [ *current_transactions, *previous_transactions, *future_transactions ]
    end

    before do
      account_transactions
      subject
    end

    it "returns a collection of transaction entries" do
      expect(response).to have_http_status :ok
      body = response.parsed_body.deep_symbolize_keys
      expect(body).to have_key(:account)
      expect(body.dig(:account, :transactions).size).to be 10
    end

    it "returns the account information including balance" do
      body = response.parsed_body.deep_symbolize_keys
      expect(body[:account][:balance])
        .to be account_transactions.map(&:total).sum
    end

    it "includes a balance prior to attribute" do
      subject
      body = response.parsed_body.deep_symbolize_keys
      expect(body[:account][:balancePriorTo])
        .to be previous_transactions.map(&:total).sum
    end
  end

  context "when the account is not found" do
    subject do
      get(api_account_transactions_path(account_key, month, year),
        headers:)
    end

    let(:account_key) { KeyGenerator.call }

    include_context "with valid token"
    include_examples "endpoint requires account"
  end

  context "when passing an unrelated account's key" do
    subject do
      get(api_account_transactions_path(account_key, month, year),
        headers:)
    end

    include_context "with valid token"
    include_context "with an account belonging to a different user group"
    let(:account_key) { KeyGenerator.call }

    include_examples "endpoint requires account"
  end

  context "when providing invalid month/year combination" do
    subject do
      get(api_account_transactions_path(account_key, month, year),
        headers:)
    end

    include_context "with valid token"
    include_examples "endpoint requires budget interval"
  end

  describe "token authentication" do
    subject do
      get(api_account_transactions_path(account_key, month, year),
        headers:)
    end

    let(:account_key) { KeyGenerator.call }
    let(:month) { rand(1..12) }
    let(:year) { rand(2020..2039) }

    it_behaves_like "a token authenticated endpoint"
  end
end
