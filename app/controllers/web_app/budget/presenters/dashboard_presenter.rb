# frozen_string_literal: true

module WebApp
  module Budget
    module Presenters
      class DashboardPresenter
        def initialize(interval)
          @interval = interval
          @user_group = interval.user_group
          @budget_month = BudgetMonthPresenter.new(interval)
        end

        def items
          @items ||= interval.detailed_items.active.by_name.to_a
        end

        def fixed_expenses
          items.select { |item| item.monthly? && item.expense? }
        end

        def fixed_revenues
          items.select { |item| item.monthly? && !item.expense? }
        end

        def variable_expenses
          items.select { |item| !item.monthly? && item.expense? }
        end

        def variable_revenues
          items.select { |item| !item.monthly? && !item.expense? }
        end

        def discretionary
          @discretionary ||= DiscretionaryPresenter.new(interval:, items:)
        end

        delegate :initial_amount,
          :over_under_budget,
          :remaining,
          :transactions_total,
          to: :discretionary

        attr_reader :interval, :user_group, :budget_month
      end
    end
  end
end
