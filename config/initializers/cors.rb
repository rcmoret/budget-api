cors_origins =
  if Rails.env.development? || Rails.env.test?
    "*"
  else
    ENV.fetch("CORS_ORIGINS", "").split(",").map(&:strip).compact_blank
  end

if cors_origins.present?
  Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins cors_origins
      resource "/api/v1/*",
        headers: :any,
        methods: %i[get post put patch delete options head]
    end
  end
end
