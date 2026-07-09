# frozen_string_literal: true

module WebApp
  module Budget
    module Dashboard
      class Serializer < PageSerializer
        nested_attribute :items do
          many :fixed_expenses, resource: ItemSerializer
          many :variable_expenses, resource: ItemSerializer
          many :fixed_revenues, resource: ItemSerializer
          many :variable_revenues, resource: ItemSerializer

          transform_keys :lower_camel
        end

        one :discretionary, resource: DiscretionarySerializer
        attribute :budget_month do
          WebApp::Budget::BudgetMonthSerializer.new(
            params[:budget_month]
          )
        end

        transform_keys :lower_camel
      end
    end
  end
end
