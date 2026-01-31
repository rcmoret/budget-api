# frozen_string_literal: true

module WebApp
  module Budget
    module Finalize
      class CreateEventsController < BaseController
        include Mixins::UsesBudgetEventsForm
        include Mixins::HasBudgetInterval

        before_action -> { @effective_timestamp = Time.current }

        after_action :update_close_out_completed_at!, if: -> { form.errors.none? }
        after_action :update_effective_start!, if: -> { form.errors.none? }

        private

        def error_component = "budget/finalize/index"

        def form_props
          API::Budget::Interval::Finalize::CategoriesSerializer.new(interval)
        end

        def update_close_out_completed_at!
          interval.prev.update(close_out_completed_at: Time.current)
        end

        def update_effective_start!
          ApplicationRecord.transaction do
            interval.update!(effective_start: @effective_timestamp)
            change_set.update!(effective_at: @effective_timestamp)
          end
        end

        def change_set
          @change_set ||= ::Budget::Changes::Rollover.create(interval: interval)
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
