# frozen_string_literal: true

module WebApp
  module Budget
    module Presenters
      class DiscretionaryPresenter
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

        private

        def available_cash
          cash_flow_transaction_detail_scope
            .or(non_cash_flow_budget_inclusion_scope)
            .joins(:account)
            .merge(::Account.belonging_to(Current.user_group))
            .joins(:details)
            .sum(:amount)
        end

        def cash_flow_transaction_detail_scope
          ::Transaction::Entry.cash_flow.then do |scope|
            if future?
              scope.between(date_range)
            else
              scope.prior_to(last_date, include_pending: current?)
            end
          end
        end

        def non_cash_flow_budget_inclusion_scope
          ::Transaction::Entry
            .non_cash_flow
            .where(budget_exclusion: false)
            .between(date_range, include_pending: current?)
        end
      end
    end
  end
end
