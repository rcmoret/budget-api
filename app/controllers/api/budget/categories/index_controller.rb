module API
  module Budget
    module Categories
      class IndexController < BaseController
        def call
          render json: serializer.render, status: :ok
        end

        private

        def serializer
          IndividualSerializer.new(
            key: :budget_categories,
            serializable: budget_categories,
          )
        end

        def budget_categories
          SerializableCollection.new(serializer: ::Budget::CategorySerializer) do
            ::Budget::Category
              .includes(maturity_intervals: :interval)
              .belonging_to(api_user)
          end
        end
      end
    end
  end
end
