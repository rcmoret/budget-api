module API
  module Budget
    module Categories
      class CreateController < BaseController
        include HasCategoryParams

        def call
          if budget_category.save
            render json: serializer.render, status: :created
          else
            render json: error_serializer.render, status: :unprocessable_entity
          end
        end

        private

        def budget_category
          @budget_category ||= ::Budget::Category.belonging_to(api_user).new(budget_category_params)
        end

        def serializer
          IndividualSerializer.new(
            key: :budget_category,
            serializable: ::Budget::CategorySerializer.new(budget_category),
          )
        end

        def error_serializer
          @error_serializer ||= ErrorsSerializer.new(
            key: :budget_category,
            model: budget_category
          )
        end
      end
    end
  end
end
