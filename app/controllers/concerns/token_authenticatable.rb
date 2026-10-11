module TokenAuthenticatable
  extend ActiveSupport::Concern

  included do
    include CubanLinx::CallChain

    execution_chain :token_auth,
      functions: %i[
        extract_bearer_token
        decode_token
        lookup_user
        validate_auth_token_context
      ]

    define_link :extract_bearer_token do |*|
      token = request.authorization.to_s[/\ABearer (?<token>.+)\z/, :token]

      if token.present?
        [ :ok, { token: } ]
      else
        [ :error, { token: :missing } ]
      end
    end

    define_link :decode_token do |payload|
      case Auth::Token::JWT.decode(payload.fetch(:token))
      in [:ok, decoded]
        [ :ok, { decoded: } ]
      in [:error, errors]
        [ :error, errors ]
      end
    end

    define_link :lookup_user do |payload|
      User::Profile.by_key(payload.fetch(:decoded)[:user_key]).then do |user|
        if user.present?
          [ :ok, { user: } ]
        else
          [ :error, { user: :not_found } ]
        end
      end
    end

    define_link :validate_auth_token_context do |payload|
      Auth::Token::Context.fetch(
        payload.fetch(:user),
        key: payload.fetch(:decoded)[:token_identifier],
      ).then do |auth_token_context|
        if auth_token_context.nil? || auth_token_context.expired?
          [ :error, { token: :invalid } ]
        else
          [ :ok, { auth_token_context: } ]
        end
      end
    end
  end

  private

  attr_reader :current_api_user, :current_token_context

  def authenticate_token!
    token_auth.call do |result|
      if result.ok?
        @current_api_user = result.fetch(:user)
        @current_token_context = result.fetch(:auth_token_context)
        Current.user_profile = current_api_user
      else
        head :unauthorized
      end
    end
  end
end
