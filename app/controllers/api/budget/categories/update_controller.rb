module API
  module Budget
    module Categories
      class UpdateController < BaseController
        include HasBudgetCategory
        include HasCategoryParams

        def call
          if budget_category.update(budget_category_params)
            render json: serializer.render, status: :accepted
          else
            render json: error_serializer.render, status: :unprocessable_entity
          end
        end

        private

        def serializer
          IndividualSerializer.new(
            key: :budget_category,
            serializable: ::Budget::CategorySerializer.new(budget_category),
          )
        end

        def error_serializer
          ErrorsSerializer.new(
            key: :budget_category,
            model: budget_category,
          )
        end
      end
    end
  end
end
