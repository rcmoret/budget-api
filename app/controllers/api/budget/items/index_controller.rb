module API
  module Budget
    module Items
      class IndexController < BaseController
        include HasBudgetInterval

        def call
          render json: serializer.render, status: :ok
        end

        private

        def serializer
          IndividualSerializer.new(
            key: :interval,
            serializable: Budget::Interval::ShowSerializer.new(api_user, interval),
            # serializable: Intervals::ShowSerializer.new(api_user, interval),
          )
        end
      end
    end
  end
end
