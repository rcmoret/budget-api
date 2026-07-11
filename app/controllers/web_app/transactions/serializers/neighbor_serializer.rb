# frozen_string_literal: true

module WebApp
  module Transactions
    module Serializers
      class NeighborSerializer < GenericSerializer
        include WebApp::Serializers::Mixins::NeighborsConcern

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
end
