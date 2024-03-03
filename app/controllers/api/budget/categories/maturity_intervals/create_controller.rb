module API
  module Budget
    module Categories
      module MaturityIntervals
        class CreateController < API::BaseController
          include HasBudgetCategory
          include HasBudgetInterval

          def call
            if maturity_interval.save
              render json: serializer.render, status: :created
            else
              render json: error_serializer.render, status: :unprocessable_entity
            end
          end

          private

          def maturity_interval
            @maturity_interval ||= ::Budget::CategoryMaturityInterval.new(
              category: budget_category,
              interval: interval,
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
        end
      end
    end
  end
end
