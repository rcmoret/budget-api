require "rails_helper"

RSpec.describe "API::V1::Tokens::CreateController" do
  subject(:create_token) do
    post "/api/v1/tokens", params: { user: { email:, password: } }, as: :json
  end

  let(:user) { create(:user, password: "correct-horse-battery") }
  let(:email) { user.email }
  let(:password) { "correct-horse-battery" }

  context "with valid credentials" do
    it "returns a token for the user" do
      create_token

      expect(response).to have_http_status(:created)
      _, decoded = Auth::Token::JWT.decode(response.parsed_body["token"])
      expect(decoded[:user_key]).to eq(user.key)
    end

    it "creates an auth token context" do
      expect { create_token }
        .to change { Auth::Token::Context.belonging_to(user).count }.by(1)
    end
  end

  context "with an incorrect password" do
    let(:password) { "wrong" }

    it "returns unauthorized" do
      create_token

      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "with an unknown email" do
    let(:email) { "nobody@example.com" }

    it "returns unauthorized" do
      create_token

      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "without user params" do
    it "returns bad request" do
      post "/api/v1/tokens", params: {}, as: :json

      expect(response).to have_http_status(:bad_request)
    end
  end
end
