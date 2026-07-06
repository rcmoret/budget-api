# frozen_string_literal: true

module WebApp
  module Budget
    module Rollover
      class FormController < BaseController
        include WebApp::Mixins::HasBudgetInterval
        include Mixins::UserChangesScope
        include Mixins::HasSlugParams
        include Mixins::HasBudgetCategoryRecord

        before_action lambda {
          @change_set = change_set_scope.first || change_set_scope.start!
        }
        before_action -> { presenter.flash = flash }

        def call
          render(
            inertia: "budget/planning/rollover/index",
            props: serializer.to_h
          )
        end

        private

        attr_reader :change_set

        delegate :data_model, to: :change_set

        def missing_budget_category?
          super && category_slug.present?
        end

        def serializer
          @serializer ||=
            WebApp::Budget::Planning::Rollover::IndexSerializer.new(
              presenter,
              params: { month:, year: }
            )
        end

        def presenter
          @presenter ||=
            ::Budget::Changes::Rollover::Presenters::IndexPresenter.new(
              data_model.with(slug: category_slug || data_model.slugs.first),
              interval,
              metadata
            )
        end

        def metadata
          Presenters::ControllerMetadata.new(
            namespace: "budget",
            page_name: "budget_planning_rollover",
            prev_selected_account_path: ""
          )
        end
      end
    end
  end
end
