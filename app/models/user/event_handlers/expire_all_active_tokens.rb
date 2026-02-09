module User
  module EventHandlers
    class ExpireAllActiveTokens < BaseHandler
      include Components::ExpireTokens
      include Components::UserVerification

      execution_chain :expire_all_active_user_tokens,
        functions: %i[
          verify_actor_is_target_user
          find_all_active_tokens_by_user
          expire_existing_token_contexts
          record_expiration_success
        ]

      def call
        expire_all_active_user_tokens.call(:ok, data)
      end

      define_link :record_expiration_success do |payload|
        User::EventForm.new(
          actor: payload.fetch(:actor),
          event_type: :user_expired_all_tokens,
        ).call
        :ok
      end
    end
  end
end
