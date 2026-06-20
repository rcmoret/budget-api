# frozen_string_literal: true

module WebApp
  module Budget
    module Dashboard
      class Serializer
        include Alba::Resource
        include Mixins::NotificationsConcern

        attributes :create_item_events

        nested_attribute :items do
          many :fixed_expenses, resource: ItemSerializer
          many :variable_expenses, resource: ItemSerializer
          many :fixed_revenues, resource: ItemSerializer
          many :variable_revenues, resource: ItemSerializer

          transform_keys :lower_camel
        end

        nested_attribute :discretionary do
          one :initial_amount, resource: MonetaryAmountSerializer
          one :over_under_budget, resource: MonetaryAmountSerializer
          one :remaining, resource: MonetaryAmountSerializer
          one :transactions_total, resource: MonetaryAmountSerializer

          transform_keys :lower_camel
        end

        one :budget_month, resource: BudgetMonthSerializer

        transform_keys :lower_camel
      end
    end
  end
end
