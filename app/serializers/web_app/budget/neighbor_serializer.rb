module WebApp
  module Budget
    class NeighborSerializer
      include Mixins::NeighborsConcern

      def href(budget_month)
        budget_index_path(month: budget_month.month, year: budget_month.year)
      end
    end
  end
end
