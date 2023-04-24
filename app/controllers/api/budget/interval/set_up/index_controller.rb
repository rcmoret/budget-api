module API
  module Budget
    module Interval
      module SetUp
        class IndexController < BaseController
          include HasBudgetInterval
          include SharedSetUpValidation

          def call
            render json: serializer.render, status: :ok
          end

          private

          def serializer
            IndividualSerializer.new(
              key: :data,
              serializable: ::Budget::Intervals::SetUp::CategoriesSerializer.new(interval),
            )
          end
        end
      end
    end
  end
end
