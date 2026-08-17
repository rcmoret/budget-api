# frozen_string_literal: true

module WebApp
  module Budget
    class EditController < BaseController
      include Mixins::HasBudgetInterval
      include Mixins::PageController

      before_action lambda {
        redirect_to budget_dashboard_path,
          alert: "Cannot edit a finalized budget month"
      },
        if: -> { interval.closed_out? }

      define_route_segment :budget
      use_template "budget/edit"
      serialize_with Serializers::DashboardSerializer

      subject do
        Presenters::DashboardPresenter.new(interval)
      end

      private

      def serializer_context
        {
          budget_month: Presenters::BudgetMonthPresenter.new(interval),
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
