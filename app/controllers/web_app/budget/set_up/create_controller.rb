# frozen_string_literal: true

module WebApp
  module Budget
    module SetUp
      class CreateController < BaseController
        include Mixins::UsesBudgetEventsForm

        after_action :update_set_up_at!, if: -> { form.errors.none? }

        private

        def update_set_up_at!
          interval.update(set_up_completed_at: Time.current)
        end
      end
    end
  end
end
