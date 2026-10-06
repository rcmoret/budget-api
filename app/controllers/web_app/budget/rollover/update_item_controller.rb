# frozen_string_literal: true

module WebApp
  module Budget
    module Rollover
      class UpdateItemController < BaseController
        include WebApp::Mixins::HasBudgetInterval
        include Mixins::RequiresChangeSet
        include Mixins::HasSlugParams
        include Mixins::HasBudgetCategoryRecord

        before_action :handle_review_item_not_found!,
          unless: :review_item_exists?

        def call
          change_set.update_review_item(
            slug: category_slug,
            item_key:,
            **item_changes
          )

          redirect_to budget_rollover_form_path(
            month,
            year,
            next_category_slug || category_slug
          )
        end

        private

        def review_item_exists?
          category = change_set.data_model.find do |cat|
            cat.slug == category_slug
          end

          category&.items&.any? { |item| item["key"] == item_key }
        end

        def item_params
          @item_params ||= params.require(:item).permit(
            :key,
            :event_key,
            adjustment: %i[display cents]
          )
        end

        def item_key = item_params[:key]

        # Only the attributes sent are changed, and an explicit null clears
        # the event key.
        def item_changes
          item_params
            .to_h
            .symbolize_keys
            .slice(:adjustment, :event_key)
        end

        def next_category_slug
          params.permit("next-category")["next-category"].presence
        end

        def handle_review_item_not_found!
          flash[:warning] = "review item not found by key: `#{item_key}`"

          redirect_to budget_rollover_form_path(month, year, category_slug)
        end
      end
    end
  end
end
