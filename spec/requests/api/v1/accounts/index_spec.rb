require "swagger_helper"

RSpec.describe "API::V1::Accounts::IndexController" do
  let(:user) { create(:user) }
  let(:Authorization) { "Bearer #{api_token_for(user)}" }

  let!(:checking) { create(:account, user_group: user.group, priority: 1) }
  let!(:savings) { create(:account, user_group: user.group, priority: 2) }
  let!(:archived) { create(:account, :archived, user_group: user.group) }

  before do
    create(:account)
    create(:transaction_entry,
      account: checking,
      details_attributes: [
        { key: KeyGenerator.call, amount: 12_34, budget_item: create(:weekly_item) },
      ])
  end

  path "/api/v1/accounts" do
    get "Lists the user's accounts for navigation" do
      tags "Accounts"
      produces "application/json"
      parameter name: :include_archived,
        in: :query,
        type: :boolean,
        required: false,
        description: "include archived accounts (default false)"

      response "200", "accounts" do
        schema type: :object,
          additionalProperties: false,
          required: %w[accounts],
          properties: {
            accounts: {
              type: :array,
              items: { "$ref" => "#/components/schemas/account_summary" },
            },
          }

        context "by default" do
          run_test! do |response|
            accounts = response.parsed_body["accounts"]

            expect(accounts.pluck("key")).to eq([ checking.key, savings.key ])
            expect(accounts.first["balance"]).to eq(12_34)
          end
        end

        context "with include_archived=true" do
          let(:include_archived) { true }

          run_test! do |response|
            expect(response.parsed_body["accounts"].pluck("key"))
              .to eq([ checking.key, savings.key, archived.key ])
          end
        end
      end

      response "401", "unauthorized" do
        let(:Authorization) { "Bearer not-a-jwt" }

        run_test!
      end
    end
  end
end
