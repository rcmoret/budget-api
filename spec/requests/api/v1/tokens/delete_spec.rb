require "swagger_helper"

RSpec.describe "API::V1::Tokens::DeleteController" do
  let(:user) { create(:user) }
  let(:auth_token_context) { create(:auth_token_context, user:) }
  let(:token) { api_token_for(user, auth_token_context:) }
  let(:Authorization) { "Bearer #{token}" }

  path "/api/v1/tokens" do
    delete "Expires the current auth token" do
      tags "Tokens"

      response "204", "token expired" do
        run_test! do
          expect(auth_token_context.reload).to be_expired
        end

        context "when the request comes from a different ip address" do
          let(:auth_token_context) do
            create(:auth_token_context, user:, ip_address: "10.0.0.99")
          end

          run_test!
        end
      end

      response "401", "unauthorized" do
        context "without a token" do
          let(:Authorization) { nil }

          run_test!
        end

        context "with a non-bearer authorization header" do
          let(:Authorization) { "Basic abc123" }

          run_test!
        end

        context "with an undecodable token" do
          let(:token) { "not-a-jwt" }

          run_test!
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

          run_test!
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

          run_test!
        end

        context "when the token context has expired" do
          let(:auth_token_context) do
            create(:auth_token_context, user:, expires_at: 1.minute.ago)
          end

          run_test!
        end

        context "when the token context was manually expired" do
          let(:auth_token_context) do
            create(:auth_token_context, :manually_expired, user:)
          end

          run_test!
        end

        context "when the token context belongs to another user" do
          let(:auth_token_context) { create(:auth_token_context) }

          run_test!
        end
      end
    end
  end
end
