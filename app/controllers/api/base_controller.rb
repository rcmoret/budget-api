module API
  class BaseController < ApplicationController
    include CubanLinx::CallChain

    before_action :authenticate_token!

    rescue_from ActionController::ParameterMissing do |exception|
      render json: { error: exception }, status: :bad_request
    end

    private

    execution_chain :token_auth,
                    functions: %i[
                      check_token_presence
                      decode_token
                      lookup_user
                      validate_auth_token_context
                      check_ip_address
                    ]

    define_link :check_token_presence do |*|
      if request.env["HTTP_AUTHORIZATION"].present?
        [:ok, { token: request.env["HTTP_AUTHORIZATION"].match(/\ABearer (?<token>.*)\z/)[:token] }]
      else
        [:error, { token: :missing }]
      end
    end

    define_link :decode_token do |payload|
      case Auth::Token::JWT.decode(payload.fetch(:token))
      in [:ok, decoded]
        [:ok, { decoded: decoded }]
      in [:error, errors]
        [:error, errors]
      end
    end

    define_link :lookup_user do |payload|
      User::Profile.by_key(payload.fetch(:decoded)[:user_key]).then do |potential_user|
        if potential_user.present?
          [:ok, { user: potential_user }]
        else
          [:error, { user: :not_found }]
        end
      end
    end

    define_link :validate_auth_token_context do |payload|
      auth_token_key = payload.fetch(:decoded)[:token_identifier]
      Auth::Token::Context.fetch(payload.fetch(:user), key: auth_token_key).then do |auth_token_context|
        if auth_token_context.nil? || auth_token_context.expired?
          [:error, { token: :invalid }]
        else
          [:ok, { auth_token_context: auth_token_context }]
        end
      end
    end

    define_link :check_ip_address do |payload|
      [:error, { token: :invalid }] unless payload.fetch(:auth_token_context).ip_address == request.ip
    end

    def authenticate_token!
      token_auth.call do |result|
        if result.ok?
          @api_user = result.fetch(:user)
          @current_user_group = result.fetch(:user).user_group
          @current_token_context = result.fetch(:auth_token_context)
        else
          render json: {}, status: :unauthorized
        end
      end
    end

    attr_reader :api_user, :current_user_group, :current_token_context
  end
end
