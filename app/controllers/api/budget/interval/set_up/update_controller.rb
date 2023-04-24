module API
  module Budget
    module Interval
      module SetUp
        class UpdateController < BaseController
          include HasBudgetInterval
          include SharedSetUpValidation

          def call
            if form.save
              render json: serializer.render, status: :accepted
            else
              render json: error_serializer.render, status: :unprocessable_entity
            end
          end

          private

          def form
            @form ||= ::Budget::Events::SetupForm.new(
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
                events: ::Budget::Events::Form::PERMITTED_PARAMS,
              ).to_h.deep_symbolize_keys
          end

          def serializer
            ::Budget::Intervals::ShowSerializer.new(api_user, interval)
          end
        end
      end
    end
  end
end
