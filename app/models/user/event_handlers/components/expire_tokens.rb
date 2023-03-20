module User
  module EventHandlers
    module Components
      module ExpireTokens
        extend ActiveSupport::Concern

        included do
          define_link :find_all_active_tokens_by_user do |payload|
            payload.fetch(:target_user).then do |user|
              [:ok, { auth_token_contexts: Auth::Token::Context.active.belonging_to(user) }]
            end
          end

          define_link :find_existing_token_contexts_by_key do |payload|
            [
              :ok,
              {
                auth_token_contexts:
                  Auth::Token::Context.where(
                    key: payload.fetch(:token_key),
                    user: payload.fetch(:target_user)
                  ),
              },
            ]
          end

          define_link :find_existing_token_contexts_by_ip_address do |payload|
            [
              :ok,
              {
                auth_token_contexts:
                  Auth::Token::Context
                    .active
                    .belonging_to(payload.fetch(:target_user))
                    .where(ip_address: payload.fetch(:ip_address)),
              },
            ]
          end

          define_link :expire_existing_token_contexts do |payload|
            payload.delete(:auth_token_contexts).then do |auth_token_contexts|
              auth_token_contexts.update(manually_expired_at: Time.current) if auth_token_contexts.any?
              :ok
            end
          end
        end
      end
    end
  end
end
