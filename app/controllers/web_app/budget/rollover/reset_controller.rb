# frozen_string_literal: true

module WebApp
  module Budget
    module Rollover
      class ResetController < BaseController
        include WebApp::Mixins::HasBudgetInterval
        include Mixins::UserChangesScope

        # Rebuilds the review data from the current budget items, dropping
        # any adjustments and targets picked so far. Without a change set
        # there's nothing to reset; the form starts a fresh one.
        def call
          change_set&.reset_data!

          redirect_to budget_rollover_form_path(month, year)
        end
      end
    end
  end
end
