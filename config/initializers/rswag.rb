return unless Rails.env.development?

Rswag::Api.configure do |config|
  config.openapi_root = Rails.root.join("swagger").to_s
end

Rswag::Ui.configure do |config|
  config.openapi_endpoint "/api-docs/v1/openapi.yaml", "Budget API v1"
end
