require "rails_helper"

RSpec.shared_context "with valid token" do
  let(:user) { FactoryBot.create(:user) }
  let(:auth_token_context) do
    FactoryBot.create(
      :auth_token_context,
      user: user,
      ip_address: "127.0.0.1",
      expires_at: expires_at,
      manually_expired_at: nil,
    )
  end
  let(:token) do
    Auth::Token::JWT.encode(
      exp: expires_at,
      payload: {
        user_key: user.key,
        token_identifier: auth_token_context.key,
      }
    )
  end
  let(:expires_at) { 1.hour.from_now }
  let(:headers) do
    { "Authorization" => "Bearer #{token}" }
  end
end
