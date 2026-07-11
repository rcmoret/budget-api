module WebApp
  module Budget
    module Serializers
      class BudgetMonthSerializer < GenericSerializer
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
          budget_month.first_date.strftime("%B %-d, %Y")
        end
        attribute(:last_date) do |budget_month|
          budget_month.last_date.strftime("%B %-d, %Y")
        end
        attribute(:is_current, &:current?)
        attribute(:is_set_up, &:set_up?)

        one :next_month,
          resource: WebApp::Serializers::Budget::NeighborSerializer
        one :previous_month,
          resource: WebApp::Serializers::Budget::NeighborSerializer
      end
    end
  end
end
