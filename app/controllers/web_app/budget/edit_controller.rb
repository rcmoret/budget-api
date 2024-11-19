# frozen_string_literal: true

module WebApp
  module Budget
    class EditController < BaseController
      include Mixins::HasBudgetInterval

      def call
        render inertia: "budget/index", props: page_props
      end

      private

      def props
        EditSerializer.new(
          current_user_profile,
          interval: interval,
          changes: form.changes
        ).render
      end

      def metadata
        {
          namespace: "budget",
          page: {
            name: "budget/index",
          },
        }
      end

      def change_params
        params.fetch(:changes, []).map do |change|
          change
            .permit(:amount, :budget_item_key, :budget_category_key)
            .to_h
            .symbolize_keys
        end
      end

      def form
        @form ||= Forms::Budget::DraftChangesForm.new(interval, changes: change_params)
      end

      def error_component = "budget/index"
    end
  end
end
