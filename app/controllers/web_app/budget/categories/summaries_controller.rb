# frozen_string_literal: true

module WebApp
  module Budget
    module Categories
      class SummariesController < BaseController
        before_action -> { render json: {}, status: :not_found },
                      if: -> { category.nil? }

        def call
          render json: payload.deep_transform_keys { |key| key.to_s.camelize(:lower) }
        end

        def payload
          {
            category: {
              id: category.id,
              budgeted_average: summaries.average(:budgeted),
              transactions_total_average: summaries.average(:transactions_total),
              limit: limit
            }
          }
        end

        private

        def summaries
          @summaries ||= category.summaries.most_recent(limit)
        end

        def limit
          params.fetch(:limit, 3)
        end

        def category
          @category ||=
            ::Budget::Category.fetch(
              current_user_profile,
              key: params.fetch(:key)
            )
        end
      end
    end
  end
end
