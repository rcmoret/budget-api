# frozen_string_literal: true

module WebApp
  module Transactions
    class NeighborSerializer < ::Serializers::GenericSerializer
      include ::WebApp::Mixins::NeighborsConcern

      def href(budget_month)
        transactions_path(
          params[:featured_account_slug],
          month: budget_month.month,
          year: budget_month.year
        )
      end
    end
  end
end
