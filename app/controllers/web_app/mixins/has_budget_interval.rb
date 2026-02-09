# frozen_string_literal: true

module WebApp
  module Mixins
    # This concern adds methods to fetch and validate budget intervals based on
    #   month/year params.
    # Returns the current interval if no month / year params are provided
    # @param month [String, null]
    # @param year [String, null]
    #
    # included do
    #   before_action :redirect_if_blank!
    # end
    #
    # Defines:
    #   - interval by month / year or current
    #   - month (from params)
    #   - year (from params)
    module HasBudgetInterval
      extend ActiveSupport::Concern

      included do
        before_action :redirect_if_blank!
      end

      private

      # Fetches or creates the budget interval based on month/year params.
      # If no params provided, returns the current interval for the user.
      # Results are memoized in @interval instance variable.
      #
      # @return [Budget::Interval] the budget interval for the current request
      # @return [nil] if interval cannot be found/created
      def interval
        @interval ||=
          if month.nil? || year.nil?
            ::Budget::Interval.belonging_to(current_user_profile).current
          else
            ::Budget::Interval.fetch(current_user_profile,
              key: { month:, year: })
          end
      end

      # Extracts the month parameter from the request.
      #
      # @return [String, nil] the month value from params
      def month
        params.permit(:month)[:month]
      end

      # Extracts the year parameter from the request.
      #
      # @return [String, nil] the year value from params
      def year
        params.permit(:year)[:year]
      end

      # Before action callback renders an error page if interval is not found.
      #
      # @return [void]
      def redirect_if_blank!
        return if interval.present?

        render error_component, props: page_props
      end

      # Returns validation errors for the current request.
      #
      # @return [Hash{Symbol => Symbol}] hash with :interval => :not_found
      #   if interval missing
      # @return [Hash] empty hash if interval is present
      def errors
        return {} if interval.present?

        { interval: :not_found }
      end
    end
  end
end
