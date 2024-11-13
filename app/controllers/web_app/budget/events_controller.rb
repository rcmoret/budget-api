# frozen_string_literal: true

module WebApp
  module Budget
    class EventsController < BaseController
      include Mixins::UsesBudgetEventsForm
    end
  end
end
