module API
  module V1
    class BaseController < ActionController::API
      include TokenAuthenticatable

      before_action :authenticate_token!

      rescue_from ActionController::ParameterMissing, KeyError do |exception|
        render json: { error: exception.message }, status: :bad_request
      end
    end
  end
end
