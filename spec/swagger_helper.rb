require "rails_helper"

RSpec.configure do |config|
  config.include(APITokenHelper, type: :request)

  config.openapi_root = Rails.root.join("swagger").to_s
  config.openapi_format = :yaml

  config.openapi_specs = {
    "v1/openapi.yaml" => {
      openapi: "3.0.3",
      info: { title: "Budget API", version: "v1" },
      paths: {},
      security: [ { bearer_auth: [] } ],
      components: {
        securitySchemes: {
          bearer_auth: { type: :http, scheme: :bearer, bearerFormat: "JWT" },
        },
        schemas: {
          account_summary: {
            type: :object,
            additionalProperties: false,
            required: %w[key name slug balance],
            properties: {
              key: { type: :string },
              name: { type: :string },
              slug: { type: :string },
              balance: { type: :integer, description: "cents" },
            },
          },
          account: {
            type: :object,
            additionalProperties: false,
            required: %w[
              key name slug balance objectKey priority isCashFlow isArchived
              archivedAt createdAt
            ],
            properties: {
              key: { type: :string },
              objectKey: { type: :string },
              name: { type: :string },
              slug: { type: :string },
              balance: { type: :integer, description: "cents" },
              priority: { type: :integer, nullable: true },
              isCashFlow: { type: :boolean },
              isArchived: { type: :boolean },
              archivedAt: { type: :string, format: "date-time", nullable: true },
              createdAt: { type: :string, format: "date-time" },
            },
          },
          category: {
            type: :object,
            additionalProperties: false,
            required: %w[
              key archivedAt createdAt defaultAmount iconClassName iconKey
              isAccrual isArchived isExpense isMonthly isPerDiemEnabled name
              objectKey slug
            ],
            properties: {
              key: { type: :string },
              objectKey: { type: :string },
              name: { type: :string },
              slug: { type: :string },
              defaultAmount: { type: :integer, description: "cents" },
              iconClassName: { type: :string, nullable: true },
              iconKey: { type: :string, nullable: true },
              isAccrual: { type: :boolean },
              isArchived: { type: :boolean },
              isExpense: { type: :boolean },
              isMonthly: { type: :boolean },
              isPerDiemEnabled: { type: :boolean },
              archivedAt: {
                type: :string,
                nullable: true,
                example: "March 4, 2026 CST",
              },
              createdAt: { type: :string, example: "March 4, 2026 CST" },
            },
          },
        },
      },
    },
  }
end
