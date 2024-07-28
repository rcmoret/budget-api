# frozen_string_literal: true

module WebApp
  module Budget
    class IndexController < BaseController
      def call
        render inertia: "budget/index", props: page_props
      end

      private

      def page_props
        super.tap { |pp| puts pp; puts pp["discretionary"].keys }
      end

      def props
        API::Budget::Interval::ShowSerializer.new(current_user, interval).render
      end

      def namespace
        "budget"
      end

      def interval
        @interval ||= if month.nil? || year.nil?
                        ::Budget::Interval.belonging_to(current_user).current
                      else
                        ::Budget::Interval.fetch(current_user, key: { month: month, year: year })
                      end
      end

      def month
        params[:month]
      end

      def year
        params[:year]
      end
    end
  end
end
