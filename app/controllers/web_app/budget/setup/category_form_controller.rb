# frozen_string_literal: true

module WebApp
  module Budget
    module Setup
      class CategoryFormController < BaseController
        # From WebApp::Budget::Setup::Mixins
        include Mixins::HasBudgetInterval
        include Mixins::HasSlugParams
        include Mixins::UserChangesScope

        before_action lambda {
          if change_set_scope.exists?
            @change_set = change_set_scope.first
            refresh_category! if category_slug.present?
          else
            @change_set = change_set_scope.start!
          end
        }

        def call
          render(
            inertia: "budget/set_up/index",
            props: ::Budget::Changes::Setup::Resources::IndexResource.new(
              data_model
              .with(slug: category_slug || data_model.slugs.first)
              .index_serializer
            ).to_h
          )
        end

        private

        attr_reader :change_set

        delegate :data_model, to: :change_set

        def budget_category_record
          @budget_category_record ||=
            ::Budget::Category.fetch(
              current_user_profile,
              slug: category_slug
            )
        end

        def refresh_category!
          change_set.refresh_category!(budget_category_record)
        end
      end
    end
  end
end
