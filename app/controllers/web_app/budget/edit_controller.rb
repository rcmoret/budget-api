# frozen_string_literal: true

module WebApp
  module Budget
    class EditController < BaseController
      include Mixins::HasBudgetInterval

      def call
        # TODO: Revisit serializer implementation. props were built from the
        # deprecated WebApp::Budget::Interval::DraftSerializer, which is pending
        # reimplementation with Alba. Rendering empty props until then.
        render inertia: "budget/dashboard/index", props: {}
      end

      private

      # Empty for now — the draft serializer that populated this is deprecated
      # (see #call). Kept because HasBudgetInterval#redirect_if_blank! renders
      # error_component with page_props, which reads props.
      def props = {}

      def metadata
        {
          namespace: "budget",
          page: {
            name: "budget/dashboard/index",
          },
        }
      end

      def error_component = "budget/dashboard/index"
    end
  end
end
