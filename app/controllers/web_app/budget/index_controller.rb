# frozen_string_literal: true

module WebApp
  module Budget
    class IndexController < BaseController
      def call
        render inertia: "budget/index", props: page_props
      end

      private

      def props
        API::Budget::Interval::ShowSerializer.new(current_user_profile, interval).render
      end

      def namespace
        "budget"
      end

      def interval
        @interval ||= if month.nil? || year.nil?
                        ::Budget::Interval.belonging_to(current_user_profile).current
                      else
                        ::Budget::Interval.fetch(current_user_profile, key: { month: month, year: year })
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
