require "rails_helper"

RSpec.shared_examples "a token authenticated endpoint" do
  before { subject }

  let(:headers) do
    { "Authorization" => "Bearer #{token}" }
  end
  let(:params) { {} }

  context "a token that does not map to a user or token context" do
    let(:token) do
      Auth::Token::JWT.encode(
        payload: {
          user_key: SecureRandom.hex(6),
          token_identifier: SecureRandom.hex(6),
        }
      )
    end

    specify { expect(response).to have_http_status :unauthorized }
  end

  context "an expired token is provided" do
    let(:user) { FactoryBot.create(:user) }
    let(:auth_token_context) { FactoryBot.create(:auth_token_context, user: user) }
    let(:token) do
      Auth::Token::JWT.encode(
        exp: 1.second.ago,
        payload: {
          user_key: user.key,
          token_identifier: auth_token_context.key,
        }
      )
    end

    specify { expect(response).to have_http_status :unauthorized }
  end

  context "a token that was manually expired is provided" do
    let(:user) { FactoryBot.create(:user) }
    let(:auth_token_context) { FactoryBot.create(:auth_token_context, :manually_expired, user: user) }
    let(:token) do
      Auth::Token::JWT.encode(
        payload: {
          user_key: user.key,
          token_identifier: auth_token_context.key,
        }
      )
    end

    specify { expect(response).to have_http_status :unauthorized }
  end

  context "when the request ip does not match the context's ip" do
    let(:user) { FactoryBot.create(:user) }
    let(:auth_token_context) do
      FactoryBot.create(
        :auth_token_context,
        user: user,
        ip_address: Faker::Internet.ip_v4_address
      )
    end
    let(:token) do
      Auth::Token::JWT.encode(
        payload: {
          user_key: user.key,
          token_identifier: auth_token_context.key,
        }
      )
    end

    specify { expect(response).to have_http_status :unauthorized }
  end
end
