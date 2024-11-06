# frozen_string_literal: true

module WebApp
  module Budget
    module SetUp
      class FormController < BaseController
        include Mixins::HasBudgetInterval

        before_action -> { redirect_to(budget_path) }, if: -> { interval.set_up? }

        def call
          render inertia: "budget/set_up/index", props: page_props
        end

        private

        def props
          API::Budget::Interval::SetUp::CategoriesSerializer.new(interval).render
        end

        def metadata
          {
            namespace: "budget",
            page: {
              name: "budget/set-up",
              month: month,
              year: year,
            },
          }
        end
      end
    end
  end
end
