# frozen_string_literal: true

module WebApp
  module Budget
    module Categories
      class IndexController < BaseController
        def call
          render inertia: "budget/categories/index", props: page_props
        end

        private

        def props = serializer.render

        def serializer
          IndexSerializer.new do
            ::Budget::Category
              .includes(:icon, maturity_intervals: :interval)
              .belonging_to(current_user_profile)
          end
        end

        def namespace = "budget"
      end
    end
  end
end
