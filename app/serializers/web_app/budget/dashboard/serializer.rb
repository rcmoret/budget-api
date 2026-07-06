# frozen_string_literal: true

module WebApp
  module Budget
    module Dashboard
      class Serializer
        include Alba::Resource
        include Mixins::NotificationsConcern
        include Accounts::NavigationConcern

        attributes :create_item_events

        nested_attribute :items do
          many :fixed_expenses, resource: ItemSerializer
          many :variable_expenses, resource: ItemSerializer
          many :fixed_revenues, resource: ItemSerializer
          many :variable_revenues, resource: ItemSerializer

          transform_keys :lower_camel
        end

        one :discretionary, resource: DiscretionarySerializer
        one :budget_month, resource: WebApp::Budget::BudgetMonthSerializer

        transform_keys :lower_camel
      end
    end
  end
end
