require "rails_helper"

RSpec.describe "API::V1::Tokens::DeleteController" do
  subject(:delete_token) do
    delete "/api/v1/tokens", headers: { "Authorization" => authorization }
  end

  let(:user) { create(:user) }
  let(:auth_token_context) { create(:auth_token_context, user:) }
  let(:token) do
    Auth::Token::JWT.encode(
      payload: {
        user_key: user.key,
        token_identifier: auth_token_context.key,
      },
    )
  end
  let(:authorization) { "Bearer #{token}" }

  context "with a valid token" do
    it "expires the token context" do
      expect { delete_token }
        .to change { auth_token_context.reload.expired? }.from(false).to(true)
    end

    it "returns no content" do
      delete_token

      expect(response).to have_http_status(:no_content)
    end
  end

  context "without an authorization header" do
    it "returns unauthorized" do
      delete "/api/v1/tokens"

      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "with a non-bearer authorization header" do
    let(:authorization) { "Basic abc123" }

    it "returns unauthorized" do
      delete_token

      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "with an undecodable token" do
    let(:token) { "not-a-jwt" }

    it "returns unauthorized" do
      delete_token

      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "with an expired jwt" do
    let(:token) do
      Auth::Token::JWT.encode(
        payload: {
          user_key: user.key,
          token_identifier: auth_token_context.key,
        },
        exp: 1.minute.ago,
      )
    end

    it "returns unauthorized" do
      delete_token

      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "with an unknown user key" do
    let(:token) do
      Auth::Token::JWT.encode(
        payload: {
          user_key: KeyGenerator.call,
          token_identifier: auth_token_context.key,
        },
      )
    end

    it "returns unauthorized" do
      delete_token

      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "when the token context has expired" do
    let(:auth_token_context) do
      create(:auth_token_context, user:, expires_at: 1.minute.ago)
    end

    it "returns unauthorized" do
      delete_token

      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "when the token context was manually expired" do
    let(:auth_token_context) do
      create(:auth_token_context, :manually_expired, user:)
    end

    it "returns unauthorized" do
      delete_token

      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "when the token context belongs to another user" do
    let(:auth_token_context) { create(:auth_token_context) }

    it "returns unauthorized" do
      delete_token

      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "when the request comes from a different ip address" do
    let(:auth_token_context) do
      create(:auth_token_context, user:, ip_address: "10.0.0.99")
    end

    it "still authenticates" do
      delete_token

      expect(response).to have_http_status(:no_content)
    end
  end
end
