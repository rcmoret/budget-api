# frozen_string_literal: true

module Presenters
  module Budget
    module Dashboard
      class IndexPresenter
        include Presenters::WebApp::FlashMessagesConcern

        def initialize(interval, metadata)
          @interval = interval
          @metadata = metadata
          @user_group = interval.user_group
        end

        def items
          @items ||= interval.detailed_items.order(name: :asc)
        end

        def budget_month
          @budget_month ||=
            BudgetMonthPresenter.new(interval)
        end

        def fixed_expenses
          items.fixed.expenses
        end

        def fixed_revenues
          items.fixed.revenues
        end

        def variable_expenses
          items.variable.expenses
        end

        def variable_revenues
          items.variable.revenues
        end

        def create_item_events
          @create_item_events ||=
            ::Budget::CreateEventsService.call(interval:)
        end

        def discretionary
          @discretionary ||=
            Presenters::Budget::Dashboard::DiscretionaryPresenter.new(
              interval:, items:
            )
        end

        delegate :initial_amount,
          :over_under_budget,
          :remaining,
          :transactions_total,
          to: :discretionary

        attr_reader :interval, :metadata, :user_group
      end
    end
  end
end
