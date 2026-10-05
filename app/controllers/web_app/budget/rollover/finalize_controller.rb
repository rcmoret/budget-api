# frozen_string_literal: true

module WebApp
  module Budget
    module Rollover
      class FinalizeController < BaseController
        include WebApp::Mixins::HasBudgetInterval
        include Mixins::UserChangesScope

        def call
          if change_set&.finalize!(current_user_profile)
            redirect_to_upcoming_dashboard
          else
            flash[:warning] = failure_message
            redirect_to budget_rollover_form_path(month, year)
          end
        end

        private

        def change_set
          @change_set ||= change_set_scope.first
        end

        def redirect_to_upcoming_dashboard
          upcoming = interval.next

          redirect_to budget_dashboard_path(upcoming.month, upcoming.year)
        end

        def failure_message
          return "there's nothing to roll over yet" if change_set.nil?

          change_set.errors.full_messages.to_sentence
        end
      end
    end
  end
end
