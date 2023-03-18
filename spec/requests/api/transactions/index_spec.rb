require "rails_helper"

RSpec.describe "GET /api/accounts/:account_slug/transactions" do
  subject { get("/api/accounts/#{account_key}/transactions/#{month}/#{year}", headers: headers) }

  context "when passing valid month, year combination" do
    include_context "with valid token"
    let(:user) { FactoryBot.create(:user) }
    let(:account) { FactoryBot.create(:account, user_group: user.user_group) }
    let(:account_key) { account.key }
    let(:interval) { FactoryBot.create(:budget_interval) }
    let(:month) { interval.month }
    let(:year) { interval.year }
    let(:date_range) { interval.date_range.to_a }

    before do
      FactoryBot.create_list(:transaction_entry, 10, account: account, clearance_date: date_range.sample)
    end

    it "returns a collection of transaction entries" do
      subject
      expect(response).to have_http_status :ok
      body = JSON.parse(response.body).deep_symbolize_keys
      expect(body).to have_key(:account)
      expect(body.dig(:account, :transactions).size).to be 10
    end

    it "returns the account information including balance"
    it "includes a balance prior to attribute"
  end

  context "when the account is not found" do
    include_context "with valid token"

    let(:user) { FactoryBot.create(:user) }
    let(:account_key) { SecureRandom.hex(6) }
    let(:interval) { FactoryBot.create(:budget_interval) }
    let(:month) { interval.month }
    let(:year) { interval.year }

    it "response with a 404, account not found" do
      subject

      expect(response).to have_http_status :not_found
      expect(JSON.parse(response.body)).to eq("account" => "not found by key: #{account_key}")
    end
  end

  context "when providing invalid month/year combination" do
    include_context "with valid token"

    let(:user) { FactoryBot.create(:user) }
    let(:account) { FactoryBot.create(:account, user_group: user.group) }
    let(:account_key) { account.key }
    let(:month) { 13 }
    let(:year) { 2023 }

    it "response with a 404, account not found" do
      subject
      expect(response).to have_http_status :not_found
      expect(JSON.parse(response.body))
        .to eq("interval" => "not found by month: #{month} and year: #{year}")
    end
  end
end
