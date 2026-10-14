require "swagger_helper"

RSpec.describe "API::V1::Accounts::ManageController" do
  let(:user) { create(:user) }
  let(:Authorization) { "Bearer #{api_token_for(user)}" }

  path "/api/v1/accounts/manage" do
    get "Lists all of the user's accounts, including archived" do
      tags "Accounts"
      produces "application/json"

      response "200", "accounts" do
        schema type: :object,
          additionalProperties: false,
          required: %w[accounts],
          properties: {
            accounts: {
              type: :array,
              items: { "$ref" => "#/components/schemas/account" },
            },
          }

        let!(:checking) { create(:account, user_group: user.group, priority: 1) }
        let!(:archived) { create(:account, :archived, user_group: user.group) }

        before { create(:account) }

        run_test! do |response|
          accounts = response.parsed_body["accounts"]

          expect(accounts.pluck("key")).to eq([ checking.key, archived.key ])
          expect(accounts.last).to include("isArchived" => true)
        end
      end

      response "401", "unauthorized" do
        let(:Authorization) { "Bearer not-a-jwt" }

        run_test!
      end
    end
  end
end
