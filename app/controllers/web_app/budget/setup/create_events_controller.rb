# frozen_string_literal: true

module WebApp
  module Budget
    module Setup
      class CreateEventsController < BaseController
        # From WebApp::Budget::Setup::Mixins
        include Mixins::HasBudgetInterval
        include Mixins::HasChangeSet

        before_action -> { @effective_at = Time.current }

        after_action lambda {
          interval.update(set_up_completed_at: @effective_at)
          change_set.update(
            events_data: {},
            effective_at: @effective_at
          )
        }, if: -> { form.errors.none? }

        def call
          if form.save
            redirect_to budget_index_path(month, year)
          else
            redirect_to budget_setup_form_path(month, year)
          end
        end

        private

        def form
          @form ||= change_set
                    .tap { |change| change.user_profile = current_user_profile }
                    .events_form
        end
      end
    end
  end
end
