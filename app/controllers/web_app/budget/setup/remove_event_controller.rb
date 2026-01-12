# frozen_string_literal: true

module WebApp
  module Budget
    module Setup
      class RemoveEventController < BaseController
        # From WebApp::Budget::Setup::Mixins
        include Mixins::HasBudgetInterval
        include Mixins::HasChangeSet
        include Mixins::HasSlugParams

        before_action :set_next_category_slug!
        before_action :remove_category!

        def call
          if change_set.slugs.include?(category_slug)
            redirect_to budget_setup_form_path(month, year, category_slug)
          else
            redirect_to budget_setup_form_path(month, year, @next_category_slug)
          end
        end

        private

        def set_next_category_slug!
          @next_category_slug = change_set
                                .data_model
                                .with(slug: category_slug)
                                .next_category_slug
        end

        def remove_category!
          change_set.remove_event(
            slug: category_slug,
            key: params.permit(:key)[:key].presence
          )
        end
      end
    end
  end
end
