# frozen_string_literal: true

module WebApp
  module Budget
    module Presenters
      class BudgetMonthPresenter < SimpleDelegator
        def days_remaining
          if current?
            [ (last_date.to_date - Time.current.to_date + 1).to_i.abs, 1 ].max
          elsif past?
            0
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
      end
    end
  end
end
