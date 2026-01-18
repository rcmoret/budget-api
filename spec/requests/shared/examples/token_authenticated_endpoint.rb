require "rails_helper"

RSpec.shared_examples "a token authenticated endpoint" do
  before { subject }

  context "when a token that does not map to a user or token context is provided" do
    let(:headers) do
      { "Authorization" => "Bearer #{token}" }
    end
    let(:params) { {} }
    let(:token) do
      Auth::Token::JWT.encode(
        payload: {
          user_key: KeyGenerator.call,
          token_identifier: KeyGenerator.call,
        }
      )
    end

    specify { expect(response).to have_http_status :unauthorized }
  end

  context "when an expired token is provided" do
    let(:headers) do
      { "Authorization" => "Bearer #{token}" }
    end
    let(:params) { {} }
    let(:user) { create(:user) }
    let(:auth_token_context) { create(:auth_token_context, user: user) }
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

  context "when a token that was manually expired is provided" do
    let(:headers) do
      { "Authorization" => "Bearer #{token}" }
    end
    let(:params) { {} }
    let(:user) { create(:user) }
    let(:auth_token_context) { create(:auth_token_context, :manually_expired, user: user) }
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
    let(:headers) do
      { "Authorization" => "Bearer #{token}" }
    end
    let(:params) { {} }
    let(:user) { create(:user) }
    let(:auth_token_context) do
      create(
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

  context "when passing empty headers" do
    let(:headers) { {} }
    let(:params) { {} }

    specify { expect(response).to have_http_status :unauthorized }
  end
end
