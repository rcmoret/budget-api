RSpec.shared_examples "endpoint requires budget interval" do
  let(:user) { create(:user) }
  let(:account) { create(:account, user_group: user.group) }
  let(:account_key) { account.key }
  let(:month) { 13 }
  let(:year) { 2023 }

  it "response with a 404, budget interval not found" do
    subject
    expect(response).to have_http_status :not_found
    expect(response.parsed_body)
      .to eq(
        "interval" => "not found by month: #{month.to_s.inspect} and year: #{year.to_s.inspect}"
      )
  end
end
