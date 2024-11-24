# frozen_string_literal: true

module WebApp
  module Budget
    module SetUp
      class CreateController < BaseController
        include Mixins::UsesBudgetEventsForm
        include Mixins::HasBudgetInterval

        after_action :update_set_up_at!, if: -> { form.errors.none? }

        private

        def error_component = "budget/set_up/index"

        def update_set_up_at!
          interval.update(set_up_completed_at: Time.current)
        end

        def form_props
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
