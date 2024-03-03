module API
  module Budget
    module Categories
      module MaturityIntervals
        class DeleteController < API::BaseController
          include HasBudgetCategory
          include HasBudgetInterval
          before_action :render_maturity_interval_not_found, if: -> { maturity_interval.nil? }

          def call
            if maturity_interval.destroy
              render json: serializer.render, status: :accepted
            else
              render json: error_serializer.render, status: :unprocessable_entity
            end
          end

          private

          def maturity_interval
            @maturity_interval ||= ::Budget::CategoryMaturityInterval.find_by(
              category: budget_category,
              interval: interval
            )
          end

          def serializer
            IndividualSerializer.new(
              key: :budget_category,
              serializable: MaturityIntervalSerializer.new(maturity_interval),
            )
          end

          def error_serializer
            ErrorsSerializer.new(
              key: :budget_category_maturity_interval,
              model: maturity_interval,
            )
          end

          def render_maturity_interval_not_found
            render json: { budgetCategory: { maturityInterval: "not found" } },
                   status: :not_found
          end
        end
      end
    end
  end
end
