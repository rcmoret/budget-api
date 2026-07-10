module WebApp
  module Transactions
    class NeighborSerializer
      include Mixins::NeighborsConcern

      def href(budget_month)
        transactions_path(
          params[:featured_account],
          month: budget_month.month,
          year: budget_month.year
        )
      end
    end
  end
end
