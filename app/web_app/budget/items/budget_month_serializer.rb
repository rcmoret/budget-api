# frozen_string_literal: true

module WebApp
  module Budget
    module Items
      # Neighbor links stay on the category's items page
      class BudgetMonthSerializer < Budget::BudgetMonthSerializer
        one :next_month,
          resource: Items::NeighborSerializer
        one :previous_month,
          resource: Items::NeighborSerializer
      end
    end
  end
end
