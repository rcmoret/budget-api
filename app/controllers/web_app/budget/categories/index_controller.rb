# frozen_string_literal: true

module WebApp
  module Budget
    module Categories
      class IndexController < BaseController
        include Mixins::PageController

        define_route_segments :budget, :categories
        serialize_with Serializers::CategorySerializer
        use_template "budget/categories"

        subject(:categories) do
          ::Budget::Category
            .includes(:icon, maturity_intervals: :interval)
            .belonging_to(current_user_profile)
            .order(:name)
            .to_a
        end
      end
    end
  end
end
