module WebApp
  module Mixins
    module Data
      module HasBudgetInterval
        extend ActiveSupport::Concern

        included do
          before_action :render_interval_not_found,
                        if: :valid_interval_not_found?
        end

        private

        def render_interval_not_found
          render json: { interval: error_message }, status: :not_found
        end

        def interval
          @interval ||= if month.blank? || year.blank?
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

        def error_message
          "not found by month: #{month.inspect} and year: #{year.inspect}"
        end

        def valid_interval_not_found?
          !(interval.present? && interval.persisted? && interval.valid?)
        end
      end
    end
  end
end
