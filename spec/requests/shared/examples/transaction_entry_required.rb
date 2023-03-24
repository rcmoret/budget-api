RSpec.shared_examples "endpoint requires transaction entry" do
  let(:user) { FactoryBot.create(:user) }
  let(:interval) { FactoryBot.create(:budget_interval, user_group: user.group) }
  let(:month) { interval.month }
  let(:year) { interval.year }
  let(:account) { FactoryBot.create(:account, user_group: user.group) }
  let(:account_key) { account.key }
  let(:transaction_key) { SecureRandom.hex(6) }

  it "returns a non found status" do
    subject
    expect(response).to have_http_status :not_found
    body = JSON.parse(response.body).deep_symbolize_keys
    expect(body).to eq(transaction: "not found by key: #{transaction_key}")
  end
end
