# frozen_string_literal: true

module WebApp
  module Budget
    module Serializers
      class DashboardSerializer < SubjectSerializer
        nested_attribute :items do
          many :fixed_expenses, resource: ItemSerializer
          many :variable_expenses, resource: ItemSerializer
          many :fixed_revenues, resource: ItemSerializer
          many :variable_revenues, resource: ItemSerializer
        end

        one :discretionary
        one :budget_month
      end
    end
  end
end
