RSpec.shared_examples "endpoint requires budget category" do
  let(:user) { create(:user) }
  let(:category) { create(:category, user_group: user.group) }
  let(:category_key) { KeyGenerator.call }

  it "response with a 404, budget category not found" do
    subject
    expect(response).to have_http_status :not_found
    expect(response.parsed_body)
      .to eq("category" => "not found by key: #{category_key}")
  end
end
