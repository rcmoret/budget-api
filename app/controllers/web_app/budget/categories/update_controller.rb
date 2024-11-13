# frozen_string_literal: true

module WebApp
  module Budget
    module Categories
      class UpdateController < BaseController
        include Mixins::HasRedirectParams
        before_action :redirect_to_budget_index, if: -> { category.nil? }

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
            update_params
          )
        end

        def category
          @category ||= ::Budget::Category.fetch(
            current_user_profile,
            key: params.fetch(:key)
          )
        end

        def redirect_to_budget_index = redirect_to budget_index_path

        # rubocop:disable Metrics/MethodLength
        def update_params
          params
            .require(:category)
            .permit(
              :name,
              :slug,
              :accrual,
              :archived_at,
              :default_amount,
              :icon_key,
              :is_per_diem_enabled,
              maturity_intervals: %i[month year _destroy]
            )
        end
        # rubocop:enable Metrics/MethodLength
      end
    end
  end
end
