# frozen_string_literal: true

module WebApp
  module Budget
    module Setup
      class CategoryFormResetController < BaseController
        # From WebApp::Budget::Setup::Mixins
        include Mixins::HasBudgetInterval
        include Mixins::UserChangesScope

        def call
          change_set_scope.sole.reset_data!

          redirect_to budget_setup_form_path(month, year)
        end
      end
    end
  end
end
