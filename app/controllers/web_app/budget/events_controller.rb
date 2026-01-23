# frozen_string_literal: true

module WebApp
  module Budget
    class EventsController < BaseController
      include Mixins::UsesBudgetEventsForm

      def change_set
        @change_set ||=
          if interval.set_up?
            ::Budget::Changes::Adjust.create(interval: interval)
          else
            ::Budget::Changes::PreSetup.create(interval: interval)
          end
      end
    end
  end
end
