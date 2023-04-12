RSpec.shared_examples "endpoint requires budget category" do
  let(:user) { FactoryBot.create(:user) }
  let(:category) { FactoryBot.create(:category, user_group: user.group) }
  let(:category_key) { SecureRandom.hex(6) }

  it "response with a 404, budget category not found" do
    subject
    expect(response).to have_http_status :not_found
    expect(JSON.parse(response.body))
      .to eq("category" => "not found by key: #{category_key}")
  end
end
