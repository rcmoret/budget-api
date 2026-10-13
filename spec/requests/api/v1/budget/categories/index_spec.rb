require "swagger_helper"

RSpec.describe "API::V1::Budget::Categories::IndexController" do
  let(:user) { create(:user) }
  let(:Authorization) { "Bearer #{api_token_for(user)}" }

  path "/api/v1/budget/categories" do
    get "Lists the user's budget categories" do
      tags "Budget Categories"
      produces "application/json"

      response "200", "categories" do
        schema type: :object,
          additionalProperties: false,
          required: %w[categories],
          properties: {
            categories: {
              type: :array,
              items: { "$ref" => "#/components/schemas/category" },
            },
          }

        let!(:groceries) do
          create(:category, user_group: user.group, name: "Groceries",
            icon: create(:icon))
        end
        let!(:archived) do
          create(:category, user_group: user.group, name: "Archived",
            archived_at: 1.day.ago)
        end

        before { create(:category) }

        run_test! do |response|
          expect(response.parsed_body["categories"].pluck("key"))
            .to eq([ archived.key, groceries.key ])
        end
      end

      response "401", "unauthorized" do
        let(:Authorization) { "Bearer not-a-jwt" }

        run_test!
      end
    end
  end
end
