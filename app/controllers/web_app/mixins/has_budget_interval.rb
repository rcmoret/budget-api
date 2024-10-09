# frozen_string_literal: true

module WebApp
  module Mixins
    module HasBudgetInterval
      extend ActiveSupport::Concern

      included do
        before_action :redirect_if_blank!
      end

      private

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

      def redirect_if_blank!
        return if interval.present?

        render error_component, props: page_props
      end

      def errors
        return {} if interval.present?

        { interval: :not_found }
      end
    end
  end
end
