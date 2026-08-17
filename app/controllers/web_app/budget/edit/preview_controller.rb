# frozen_string_literal: true

module WebApp
  module Budget
    module Edit
      class PreviewController < BaseController
        include Mixins::HasBudgetInterval

        def call
          render json: Serializers::DiscretionarySerializer.new(discretionary).to_h
        end

        private

        def discretionary
          Presenters::DiscretionaryPresenter.new(interval:, items: preview_items)
        end

        def preview_items
          real_items = interval.detailed_items.active.to_a
          draft_keys = draft_items.map(&:key)

          real_items.reject { |item| draft_keys.include?(item.key) } + draft_items
        end

        def draft_items
          @draft_items ||=
            ::Forms::Budget::DraftChangesForm
              .new(interval, changes: changes_params)
              .changes
              .map { |change| ::Budget::DraftItem.new(change) }
        end

        def changes_params
          raw_changes.map do |change|
            next change.except(:event_type) if change[:event_type] == "item_create"

            current_amount = current_items_by_key[change[:budget_item_key]]&.amount || 0
            change.merge(amount: change[:amount].to_i - current_amount).except(:event_type)
          end
        end

        def current_items_by_key
          @current_items_by_key ||=
            interval.detailed_items.active.index_by(&:key)
        end

        def raw_changes
          params.require(:changes).map do |change|
            change
              .permit(:budget_item_key, :budget_category_key, :amount, :event_type)
              .to_h
              .symbolize_keys
          end
        end
      end
    end
  end
end
