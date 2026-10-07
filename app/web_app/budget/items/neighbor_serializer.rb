# frozen_string_literal: true

module WebApp
  module Budget
    module Items
      class NeighborSerializer < ::Serializers::GenericSerializer
        include ::WebApp::Mixins::NeighborsConcern

        def href(budget_month)
          budget_items_path(
            month: budget_month.month,
            year: budget_month.year,
            category_slug: params[:category_slug]
          )
        end
      end
    end
  end
end
