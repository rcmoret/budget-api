# frozen_string_literal: true

module WebApp
  module Serializers
    module Budget
      class NeighborSerializer < GenericSerializer
        include Mixins::NeighborsConcern

        def href(budget_month)
          budget_dashboard_path(
            month: budget_month.month,
            year: budget_month.year
          )
        end
      end
    end
  end
end
