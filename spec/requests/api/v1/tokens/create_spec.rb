require "swagger_helper"

RSpec.describe "API::V1::Tokens::CreateController" do
  let(:user) { create(:user, password: "correct-horse-battery") }
  let(:email) { user.email }
  let(:password) { "correct-horse-battery" }
  let(:credentials) { { user: { email:, password: } } }

  path "/api/v1/tokens" do
    post "Creates an auth token" do
      tags "Tokens"
      security []
      consumes "application/json"
      produces "application/json"
      parameter name: :credentials, in: :body, schema: {
        type: :object,
        required: %w[user],
        properties: {
          user: {
            type: :object,
            required: %w[email password],
            properties: {
              email: { type: :string, format: :email },
              password: { type: :string, format: :password },
            },
          },
        },
      }

      response "201", "token created" do
        schema type: :object,
          additionalProperties: false,
          required: %w[token],
          properties: { token: { type: :string } }

        run_test! do |response|
          _, decoded = Auth::Token::JWT.decode(response.parsed_body["token"])

          expect(decoded[:user_key]).to eq(user.key)
          expect(Auth::Token::Context.belonging_to(user)).to exist
        end
      end

      response "401", "invalid credentials" do
        schema type: :object,
          required: %w[password],
          properties: {
            password: { type: :array, items: { type: :string } },
          }

        context "with an incorrect password" do
          let(:password) { "wrong" }

          run_test!
        end

        context "with an unknown email" do
          let(:email) { "nobody@example.com" }

          run_test!
        end
      end

      response "400", "missing parameters" do
        schema type: :object,
          required: %w[error],
          properties: { error: { type: :string } }

        let(:credentials) { {} }

        run_test!
      end
    end
  end
end
