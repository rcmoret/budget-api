RSpec.shared_examples "endpoint requires account" do
  let(:user) { create(:user) }
  let(:interval) { create(:budget_interval, user_group: user.group) }
  let(:month) { interval.month }
  let(:year) { interval.year }

  it "returns a not found status" do
    subject
    expect(response).to have_http_status :not_found
    body = response.parsed_body.deep_symbolize_keys
    expect(body).to eq(account: "not found by key: #{account_key}")
  end
end
