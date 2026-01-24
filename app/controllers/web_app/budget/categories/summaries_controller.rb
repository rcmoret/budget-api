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
              budgeted_average: budgeted_average,
              transactions_total_average: transactions_total_average,
              limit: count,
              data: data,
            },
          }
        end

        private

        def summaries
          @summaries ||= summaries_scope.most_recent(limit)
        end

        def limit
          permitted_params.fetch(:limit, 3)
        end

        def summaries_scope
          category
            .summaries
            .then do |scope|
              scope = scope.before(**before_params.to_h.symbolize_keys) unless before_params.empty?

              scope.most_recent(limit)
            end
        end

        def category
          @category ||=
            ::Budget::Category.fetch(
              current_user_profile,
              key: params.fetch(:key)
            )
        end

        def transactions_total_average
          return 0 if count.zero?

          summaries.sum(&:transactions_total) / summaries.count
        end

        def budgeted_average
          return 0 if count.zero?

          summaries.sum(&:budgeted) / summaries.count
        end

        def count
          @count ||= summaries.count
        end

        def permitted_params
          params
            .permit(:limit, :key, before: %i[month year])
        end

        def before_params
          permitted_params.fetch(:before, {})
        end

        def data
          summaries.map(&:as_resource).map(&:to_h)
        end
      end
    end
  end
end
