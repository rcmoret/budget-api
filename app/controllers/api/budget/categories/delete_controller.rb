module API
  module Budget
    module Categories
      class DeleteController < BaseController
        include HasBudgetCategory

        def call
          budget_category.destroy

          if budget_category.destroyed?
            render json: deleted_serializer.render, status: :accepted
          elsif budget_category.archived?
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

        def deleted_serializer
          IndividualSerializer.new(
            key: :budget_category,
            serializable: DeletedSerializer.new([budget_category.id])
          )
        end

        def error_serializer
          ErrorsSerializer.new(
            key: :budget_category,
            model: budget_category,
          )
        end

        DeletedSerializer = Class.new(ApplicationSerializer) do
          attribute :deleted_budget_category_ids, alias_of: :to_a
        end
      end
    end
  end
end
