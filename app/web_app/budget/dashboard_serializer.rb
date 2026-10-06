# frozen_string_literal: true

module WebApp
  module Budget
    class DashboardSerializer < ::Serializers::SubjectSerializer
      nested_attribute :items do
        many :fixed_expenses, resource: Dashboard::ItemSerializer
        many :variable_expenses, resource: Dashboard::ItemSerializer
        many :fixed_revenues, resource: Dashboard::ItemSerializer
        many :variable_revenues, resource: Dashboard::ItemSerializer
      end

      one :discretionary, resource: Dashboard::DiscretionarySerializer
      one :budget_month, resource: BudgetMonthSerializer
    end
  end
end
