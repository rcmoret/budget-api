# frozen_string_literal: true

module WebApp
  module Budget
    module Presenters
      class BudgetMonthPresenter < SimpleDelegator
        def days_remaining
          if past? || last_date.to_date < Time.current.to_date
            0
          elsif current?
            [ (last_date.to_date - Time.current.to_date + 1).to_i.abs, 1 ].max
          else
            total_days
          end
        end

        def total_days
          (last_date.to_date - first_date.to_date)
            .to_i + 1
        end

        def next_month
          @next_month ||= self.class.new(__getobj__.next)
        end

        def previous_month
          @previous_month ||= self.class.new(__getobj__.prev)
        end

        def rollover_route
          return "" unless current? && days_remaining < 3

          Rails
            .application
            .routes.url_helpers
            .budget_rollover_form_path(
              month:,
              year:,
            )
        end

        def setup_route(month:, year:)
          return "" if set_up?
          return "" if month.blank? || year.blank?

          Rails
            .application
            .routes.url_helpers
            .budget_setup_form_path(
              month:,
              year:,
            )
        end
      end
    end
  end
end
