module API
  module Budget
    module Interval
      module Finalize
        class IndexController < BaseController
          include HasBudgetInterval

          def call
            render json: serializer.render, status: :ok
          end

          private

          def serializer
            IndividualSerializer.new(
              key: :data,
              serializable: ::Budget::Intervals::Finalize::CategoriesSerializer.new(interval),
            )
          end
        end
      end
    end
  end
end
