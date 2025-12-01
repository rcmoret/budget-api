# frozen_string_literal: true

module WebApp
  module Budget
    module Finalize
      class CreateEventsController < BaseController
        include Mixins::UsesBudgetEventsForm
        include Mixins::HasBudgetInterval

        after_action :update_close_out_completed_at!, if: -> { form.errors.none? }

        private

        def error_component = "budget/set_up/index"

        def form_props
          API::Budget::Interval::Finalize::CategoriesSerializer.new(interval)
        end

        def update_close_out_completed_at!
          interval.update(close_out_completed_at: Time.current)
        end

        def metadata
          {
            namespace: "budget",
            page: {
              name: "budget/finalize",
              month: month,
              year: year,
            },
          }
        end
      end
    end
  end
end
