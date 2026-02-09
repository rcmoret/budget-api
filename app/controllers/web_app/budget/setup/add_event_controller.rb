# frozen_string_literal: true

module WebApp
  module Budget
    module Setup
      class AddEventController < BaseController
        # From WebApp::Budget::Setup::Mixins
        include Mixins::HasBudgetInterval
        include Mixins::HasChangeSet
        include Mixins::HasBudgetCategoryRecord
        include Mixins::HasSlugParams

        def call
          change_set.add_item_event(budget_category_record)

          redirect_to budget_setup_form_path(
            month,
            year,
            budget_category_record.slug
          )
        end

        private

        def permitted_params
          params.require(:event)
          params
            .permit(event: [ { adjustment: %i[display cents] } ])
            .fetch(:event)
        end
      end
    end
  end
end
