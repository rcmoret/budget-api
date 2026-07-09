# frozen_string_literal: true

module Presenters
  module Budget
    module Dashboard
      class IndexPresenter
        def initialize(interval)
          @interval = interval
          @user_group = interval.user_group
        end

        def items
          @items ||= interval.detailed_items.active.order(name: :asc).to_a
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
          @discretionary ||=
            Presenters::Budget::Dashboard::DiscretionaryPresenter.new(
              interval:,
              items:
            )
        end

        delegate :initial_amount,
          :over_under_budget,
          :remaining,
          :transactions_total,
          to: :discretionary

        attr_reader :interval, :user_group
      end
    end
  end
end
