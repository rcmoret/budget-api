module User
  module EventHandlers
    class ExpireTokenByKey < BaseHandler
      include Components::ExpireTokens
      include Components::UserVerification

      execution_chain :expire_user_token_by_key,
                      functions: %i[
                        verify_actor_is_target_user
                        find_existing_token_contexts_by_key
                        expire_existing_token_contexts
                        record_expiration_success
                      ]

      def call
        expire_user_token_by_key.call(:ok, data)
      end

      define_link :record_expiration_success do |payload|
        User::EventForm.new(
          actor: payload.fetch(:actor),
          event_type: :user_expired_token_by_key,
        ).call
        :ok
      end
    end
  end
end
