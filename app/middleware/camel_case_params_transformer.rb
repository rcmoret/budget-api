# frozen_string_literal: true

class CamelCaseParamsTransformer
  def initialize(app)
    @app = app
  end

  def call(env)
    request = ActionDispatch::Request.new(env)

    # Transform parameters for multipart requests (file uploads)
    transform_params(request.params) if request.content_type&.include?("multipart/form-data")

    @app.call(env)
  end

  private

  def transform_params(params)
    params.deep_transform_keys! do |key|
      key.respond_to?(:underscore) ? key.underscore : key
    end
  end
end
