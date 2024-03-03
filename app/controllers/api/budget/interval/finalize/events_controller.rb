module API
  module Budget
    module Interval
      module Finalize
        class EventsController < BaseController
          include HasBudgetInterval

          def call
            if form.save
              render json: serializer.render, status: :created
            else
              render json: error_serializer.render, status: :unprocessable_entity
            end
          end

          private

          def form
            @form ||= Forms::Budget::FinalizeIntervalForm.new(
              user: api_user,
              interval: interval,
              **form_params
            )
          end

          def error_serializer
            ErrorsSerializer.new(
              key: :events_form,
              model: form,
            )
          end

          def form_params
            params
              .require(:interval)
              .permit(events: Forms::Budget::EventParams::PERMITTED)
              .to_h
              .deep_symbolize_keys
          end

          def serializer
            API::Budget::Interval::ShowSerializer.new(api_user, interval)
            # ShowSerializer.new(api_user, interval)
          end
        end
      end
    end
  end
end
