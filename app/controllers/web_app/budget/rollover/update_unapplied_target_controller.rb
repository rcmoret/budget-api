# frozen_string_literal: true

module WebApp
  module Budget
    module Rollover
      class UpdateUnappliedTargetController < BaseController
        include WebApp::Mixins::HasBudgetInterval
        include Mixins::RequiresChangeSet

        TARGET_ATTRIBUTES = %i[
          key
          event_type
          budget_category_key
          budget_item_key
          name
          slug
        ].freeze

        # Stores, or clears with a null target, where the unapplied total
        # will go. Nothing is applied until the rollover is finalized.
        def call
          unless change_set.update_unapplied_target_event(target_event)
            flash[:warning] = change_set.errors.full_messages.to_sentence
          end

          redirect_to_form!
        end

        private

        # The top-level key is a single word because JSONParamsTransformer
        # only underscores nested keys.
        def target_event
          params.permit(target: TARGET_ATTRIBUTES).to_h.fetch("target", nil)
        end

        def redirect_to_form!
          redirect_to budget_rollover_form_path(
            month,
            year,
            params.permit(:slug)[:slug].presence
          )
        end
      end
    end
  end
end
