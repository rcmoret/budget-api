module User
  module EventHandlers
    class NewAuthTokenRequested < BaseHandler
      include Components::ExpireTokens
      include Components::GenerateToken
      include Components::UserVerification

      define_link :record_token_generated_event do |payload|
        User::EventForm.new(
          actor: payload.fetch(:actor),
          event_type: :user_token_generated,
          event_data: SuccessData.new(payload).render(camelize: false),
        ).call
        :ok
      end

      execution_chain :generate_new_auth_token,
        functions: %i[
          verify_actor_is_target_user
          verify_password
          find_existing_token_contexts_by_ip_address
          expire_existing_token_contexts
          build_token_context_attributes
          save_token_context
          generate_jwt
          record_token_generated_event
        ]

      def call
        generate_new_auth_token.call(:ok, **data,
          transient_data:) do |result|
          if result.ok?
            [ :ok, { token: result.fetch(:token) } ]
          else
            [ :error, result.errors ]
          end
        end
      end

      SuccessData = Class.new(ApplicationSerializer) do
        attributes :ip_address, :event_key
        attribute :auth_token_key

        def auth_token_key
          auth_token_context.key
        end
      end
      private_constant :SuccessData
    end
  end
end
