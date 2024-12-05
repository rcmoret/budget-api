module API
  module Budget
    module Interval
      module SetUp
        class UpdateController < BaseController
          include HasBudgetInterval
          include SharedSetUpValidation

          def call
            if form.save
              render json: serializer.render, status: :created
            else
              render json: error_serializer.render, status: :unprocessable_entity
            end
          end

          private

          def form
            @form ||= Forms::Budget::Events::SetupForm.new(
              user: api_user,
              interval: interval,
              **form_params
            )
          end

          def form_params
            params
              .require(:interval)
              .permit(
                :start_date,
                :end_date,
                :set_up_completed_at,
                events: Forms::Budget::EventParams::PERMITTED,
              ).to_h.deep_symbolize_keys
          end

          def serializer
            ShowSerializer.new(api_user, interval)
          end
        end
      end
    end
  end
end
