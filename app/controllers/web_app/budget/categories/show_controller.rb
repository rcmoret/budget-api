# frozen_string_literal: true

module WebApp
  module Budget
    module Categories
      class ShowController < BaseController
        before_action -> { redirect_to budget_index_path },
          if: -> { category.nil? }

        def call
          render inertia: "budget/categories/show", props: page_props
        end

        private

        def props
          @props ||= ShowSerializer.new(
            category,
            current_user_profile:,
            chart_params: chart_params.to_h.deep_symbolize_keys
          ).render
        end

        def chart_params
          allowed_chart_params = %i[
            limit
            start_month
            start_year
            end_month
            end_year
          ]

          params.permit(q: allowed_chart_params)[:q] || {}
        end

        def metadata
          {
            namespace: "budget",
            page: {
              name: "budget/category/show",
            },
          }
        end

        def category
          @category ||= ::Budget::Category.fetch(
            current_user_profile,
            slug: params.fetch(:slug)
          )
        end
      end
    end
  end
end
