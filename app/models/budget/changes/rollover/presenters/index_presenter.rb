module Budget
  module Changes
    class Rollover
      module Presenters
        # The navigation/grouping logic is identical to setup; only the form
        # route the category links point to differs.
        class IndexPresenter < Setup::Presenters::IndexPresenter
          def show_path(category_slug)
            budget_rollover_form_path(
              month:,
              year:,
              slug: category_slug
            )
          end
        end
      end
    end
  end
end
