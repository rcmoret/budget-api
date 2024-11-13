# frozen_string_literal: true

module WebApp
  module Budget
    module Categories
      class CreateController < BaseController
        include Mixins::HasRedirectParams

        def call
          if form.save
            redirect_to redirect_path
          else
            redirect_to budget_index_path
          end
        end

        private

        def form
          @form ||= Forms::Budget::CategoryForm.new(
            current_user_profile,
            category,
            create_params
          )
        end

        def category
          @category ||= ::Budget::Category.belonging_to(current_user_profile).new
        end

        # rubocop:disable Metrics/MethodLength
        def create_params
          params
            .require(:category)
            .permit(
              :key,
              :name,
              :slug,
              :accrual,
              :default_amount,
              :expense,
              :icon_key,
              :is_per_diem_enabled,
              :monthly,
              maturity_intervals: %i[month year _destroy]
            )
        end
        # rubocop:enable Metrics/MethodLength
      end
    end
  end
end
