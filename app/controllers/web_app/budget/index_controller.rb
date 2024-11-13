# frozen_string_literal: true

module WebApp
  module Budget
    class IndexController < BaseController
      include Mixins::HasBudgetInterval

      def call
        render inertia: "budget/index", props: page_props
      end

      private

      def props
        API::Budget::Interval::ShowSerializer.new(current_user_profile, interval).render
      end

      def metadata
        {
          namespace: "budget",
          page: {
            name: "budget/index",
          },
        }
      end

      def error_component = "budget/index"
    end
  end
end
