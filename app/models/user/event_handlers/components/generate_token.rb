module User
  module EventHandlers
    module Components
      module GenerateToken
        extend ActiveSupport::Concern

        included do
          define_link :build_token_context_attributes do |payload|
            ok_tuple(
              auth_token_context_attributes: {
                user_id: payload.fetch(:target_user).id,
                key: SecureRandom.hex(6),
                ip_address: data.fetch(:ip_address),
                expires_at: 24.hours.from_now,
              },
            )
          end

          define_link :save_token_context do |payload|
            auth_token_context = Auth::Token::Context.new(payload.fetch(:auth_token_context_attributes))
            if auth_token_context.save
              [:ok, { auth_token_context: auth_token_context }]
            else
              errors = auth_token_context.errors.to_hash
              User::EventForm.new(actor: payload.fetch(:actor), event_type: :token_error, event_data: errors).call
              [:error, errors]
            end
          end

          define_link :generate_jwt do |payload|
            payload.fetch(:auth_token_context).then do |auth_token_context|
              token = Auth::Token::JWT.encode(
                payload: { user_id: auth_token_context.user_id, token_identifier: auth_token_context.key },
                exp: auth_token_context.expires_at.to_i,
              )
              [:ok, { token: token }]
            end
          end
        end
      end
    end
  end
end
