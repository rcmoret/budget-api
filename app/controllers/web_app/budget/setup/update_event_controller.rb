# frozen_string_literal: true

module WebApp
  module Budget
    module Setup
      class UpdateEventController < BaseController
        # From WebApp::Budget::Setup::Mixins
        include Mixins::HasBudgetInterval
        include Mixins::HasChangeSet
        include Mixins::HasBudgetCategoryRecord
        include Mixins::HasSlugParams
        include NumericStringToCents

        def call
          update_category!

          if next_category_slug.present?
            redirect_to budget_setup_form_path(month, year, next_category_slug)
          else
            redirect_to budget_setup_form_path(month, year, budget_category_record.slug)
          end
        end

        private

        def update_category!
          change_set.update_category_events(
            budget_category_record,
            events: permitted_params.reduce({}) do |memo, ev|
              memo.merge(
                ev["budget_item_key"] => {
                  display: ev["adjustment"]["display"],
                  cents: numeric_string_to_cents(ev["adjustment"]["display"]),
                }
              )
            end
          )
        end

        def data_model
          @data_model ||= change_set.data_model.with(slug: category_slug)
        end

        def budget_category
          @budget_category ||= data_model.category
        end

        def next_category_slug
          params.permit("next-category")["next-category"]
        end

        def permitted_params
          params.require(:events)
          params
            .permit(events: [:budget_item_key, { adjustment: %i[display cents] }])
            .fetch(:events)
        end
      end
    end
  end
end
