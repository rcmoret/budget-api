# frozen_string_literal: true

module WebApp
  module Budget
    module Rollover
      class FormController < BaseController
        include WebApp::Mixins::HasBudgetInterval
        include Mixins::UserChangesScope
        include Mixins::HasSlugParams
        include Mixins::HasBudgetCategoryRecord
        include WebApp::Mixins::PageController

        define_route_segments :budget
        serialize_with FormSerializer
        subject do
          FormPresenter.new(
            data_model.with(slug: category_slug),
            interval
          )
        end
        use_template "budget/planning/rollover/index"

        private

        def change_set
          @change_set ||= change_set_scope.first || change_set_scope.start!
        end

        delegate :data_model, to: :change_set

        def missing_budget_category?
          super && category_slug.present?
        end

        def serializer_context = { month:, year: }

        def route_segments
          super(month, year, "roll-over", category_slug)
        end
      end
    end
  end
end
