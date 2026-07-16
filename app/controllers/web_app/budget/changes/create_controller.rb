# frozen_string_literal: true

module WebApp
  module Budget
    module Changes
      class CreateController < BaseController
        include Mixins::HasBudgetInterval
        include Mixins::HasRedirectParams

        before_action -> { @effective_timestamp = Time.current }
        after_action :set_effective_at!, if: -> { form.errors.none? }

        def call
          if form.save
            redirect_to redirect_path,
              notice: success_notifications
          else
            flash[:alert] = "We couldn't add that item."
            redirect_to redirect_path, inertia: { errors: inertia_errors }
          end
        end

        private

        def change_set
          @change_set ||=
            if interval.set_up?
              ::Budget::Changes::Adjust.create(interval:)
            else
              ::Budget::Changes::PreSetup.create(interval:)
            end
        end

        def success_notifications
          Serializers::NotificationsSerializer
            .new(events: change_set.events)
            .to_h["notifications"]
        end

        def set_effective_at!
          change_set.update(effective_at: @effective_timestamp)
        end

        def inertia_errors
          form.errors.to_hash.each_with_object({}) do |(key, messages), acc|
            messages.each do |message|
              if message.is_a?(Hash)
                message.each do |field, msgs|
                  acc[field.to_s] = Array(msgs).join(", ")
                end
              else
                acc[key.to_s] = Array(message).join(", ")
              end
            end
          end
        end

        def form
          @form ||= Forms::Budget::EventsForm.new(
            current_user_profile,
            change_set,
            events: events_params
          )
        end

        def page_name
          params.permit(:page_name)[:page_name]
        end

        def events_params
          params.require(:events).map do |event_params|
            event_params.permit(*::Forms::Budget::EventParams::PERMITTED)
          end
        end
      end
    end
  end
end
