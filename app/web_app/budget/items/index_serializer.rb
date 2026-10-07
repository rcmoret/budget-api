# frozen_string_literal: true

module WebApp
  module Budget
    module Items
      class IndexSerializer < ::Serializers::SubjectSerializer
        many :items, resource: Items::ItemSerializer
        one :discretionary, resource: Dashboard::DiscretionarySerializer
        one :budget_month, resource: Items::BudgetMonthSerializer
      end
    end
  end
end
