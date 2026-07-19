# frozen_string_literal: true

module WebApp
  module Budget
    module Setup
      class CategoryFormController < BaseController
        # From WebApp::Budget::Setup::PlanningMixins
        include PlanningMixins::HasBudgetInterval
        include PlanningMixins::HasSlugParams
        include PlanningMixins::UserChangesScope
        include PlanningMixins::HasBudgetCategoryRecord
        include Mixins::PageController

        before_action lambda {
          if change_set_scope.exists?
            @change_set = change_set_scope.first
            refresh_category! if budget_category_record.present?
          else
            @change_set = change_set_scope.start!
          end
        }

        define_route_segments :budget
        serialize_with Serializers::IndexSerializer
        subject do
          Presenters::IndexPresenter.new(
            data_model.with(slug: category_slug || data_model.slugs.first),
            interval,
          )
        end
        use_template "budget/planning/setup"

        private

        attr_reader :change_set

        delegate :data_model, to: :change_set

        def missing_budget_category?
          super && category_slug.present?
        end

        def serializer_context = { month:, year: }

        def refresh_category!
          change_set.refresh_category!(budget_category_record)
        end

        def route_segments
          super(month, year, "set-up", category_slug)
        end
      end
    end
  end
end
