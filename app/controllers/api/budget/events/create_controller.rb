module API
  module Budget
    module Events
      class CreateController < BaseController
        include HasBudgetInterval

        def call
          if form.save
            render json: serializer.render, status: :ok
          else
            render json: error_serializer.render, status: :unprocessable_entity
          end
        end

        private

        def form
          @form ||= Forms::Budget::EventsForm.new(api_user, events: events_params)
        end

        def error_serializer
          IndividualSerializer.new(
            key: :events_form,
            serializable: ErrorsSerializer.new(form.errors)
          )
        end

        def events_params
          params.require(:events).map do |event_params|
            event_params.permit(*::Forms::Budget::EventParams::PERMITTED)
          end
        end

        def serializer
          ResponseSerializer.new(
            interval: interval,
            budget_item_keys: events_params.pluck(:budget_item_key)
          )
        end
      end
    end
  end
end
