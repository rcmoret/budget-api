# frozen_string_literal: true

module Presenters
  module Budget
    module Dashboard
      class DiscretionaryPresenter
        include ::WebApp::Mixins::AvailableCash

        def initialize(interval:, items:)
          @interval = interval
          @items = items
        end

        def remaining
          @remaining ||=
            items.map(&:remaining).sum + available_cash
        end

        def initial_amount
          remaining - transactions_total - over_under_budget
        end

        def over_under_budget
          @over_under_budget ||= items.sum(&:budget_impact)
        end

        def transactions_total
          @transactions_total || transaction_details.sum(&:amount)
        end

        def transaction_details
          @transaction_details ||=
            Transaction::BudgetDetail
            .belonging_to(user_group)
            .budget_inclusions
            .between(date_range, include_pending: current?)
        end

        attr_reader :items, :interval

        delegate :last_date,
          :future?,
          :date_range,
          :current?,
          :user_group,
          to: :interval
      end
    end
  end
end
