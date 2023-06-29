module User
  module EventHandlers
    module Components
      module UserVerification
        extend ActiveSupport::Concern

        included do
          define_link :verify_actor_is_target_user do |payload|
            if payload.fetch(:actor) == payload.fetch(:target_user)
              :ok
            else
              [:error, { user: ["actor and target user mismatch"] }]
            end
          end

          define_link :verify_password do |payload|
            payload.fetch(:target_user).then do |user|
              if user.authenticate(transient_data.fetch(:password))
                :ok
              else
                User::EventForm.new(actor: payload.fetch(:actor), event_type: :incorrect_password_attempt).call
                [:error, { password: ["incorrect password"] }]
              end
            end
          end
        end
      end
    end
  end
end
