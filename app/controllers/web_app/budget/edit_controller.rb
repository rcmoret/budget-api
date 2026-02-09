# frozen_string_literal: true

module WebApp
  module Budget
    class EditController < BaseController
      include Mixins::HasBudgetInterval

      def call
        render inertia: "budget/dashboard/index", props: page_props
      end

      private

      def props
        IndividualSerializer.new(
          key: :draft,
          serializable: draft_serializer
        )
      end

      def draft_serializer
        WebApp::Budget::Interval::DraftSerializer.new(
          interval,
          changes: form.changes
        )
      end

      def metadata
        {
          namespace: "budget",
          page: {
            name: "budget/dashboard/index",
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
        @form ||=
          Forms::Budget::DraftChangesForm.new(
            interval,
            changes: change_params
          )
      end

      def error_component = "budget/dashboard/index"

      def change_set
        @change_set ||=
          if interval.set_up?
            Budget::ChangeSet.adjust.create(interval:)
          else
            Budget::ChangeSet.pre_setup.create(interval:)
          end
      end
    end
  end
end
