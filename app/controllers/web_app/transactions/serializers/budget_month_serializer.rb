# frozen_string_literal: true

module WebApp
  module Transactions
    module Serializers
      class BudgetMonthSerializer < GenericSerializer
        FORMAT = "%B %-d, %Y"

        attributes :month,
          :year,
          :days_remaining,
          :total_days

        attribute(:month_name) do |budget_month|
          Time
            .new(budget_month.year, budget_month.month, 15)
            .strftime("%B")
        end
        attribute(:first_date) do |budget_month|
          budget_month.first_date.strftime(FORMAT)
        end
        attribute(:last_date) do |budget_month|
          budget_month.last_date.strftime(FORMAT)
        end
        attribute(:is_current, &:current?)

        one :next_month, resource: NeighborSerializer
        one :previous_month, resource: NeighborSerializer
      end
    end
  end
end
