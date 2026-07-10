# frozen_string_literal: true

module WebApp
  module Budget
    class DashboardController < BaseController
      include Mixins::HasBudgetInterval
      include Mixins::PageController

      define_route_segment :budget
      use_template "budget/dashboard"
      serialize_with WebApp::Budget::Dashboard::Serializer
      subject do
        Presenters::Budget::Dashboard::IndexPresenter.new(interval)
      end

      private

      def serializer_context
        {
          budget_month:
            Presenters::Budget::BudgetMonthPresenter.new(interval),
          month:,
          year:,
        }
      end

      def route_segments
        super(month, year)
      end
    end
  end
end
