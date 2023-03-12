# frozen_string_literal: true

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  if Rails.env.development? || Rails.env.test?
    allow do
      origins "*"
      resource "/api/*", headers: :any, methods: %i[get post patch put]
    end
  end
end
