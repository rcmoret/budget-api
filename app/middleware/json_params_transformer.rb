# frozen_string_literal: true

class JSONParamsTransformer
  def initialize(app)
    @app = app
  end

  def call(env)
    request = ActionDispatch::Request.new(env)

    # Transform parameters for application/json
    if request.content_type.to_s == "application/json"
      transform_params(request.params)
    end

    @app.call(env)
  end

  private

  def transform_params(params)
    if params.is_a?(Array)
      params.map { |item| item.deep_transform_keys!(&:underscore) }
    else
      params.deep_transform_keys!(&:underscore)
    end

    # Return data
    params.is_a?(Hash) ? params : { _json: params }
  end
end
