# frozen_string_literal: true

module WebApp
  module Mixins
    module AvailableCash
      def available_cash
        cash_flow_transaction_detail_scope
          .or(non_cash_flow_budget_inclusion_scope)
          .belonging_to(user_group)
          .sum(:amount)
      end

      def cash_flow_transaction_detail_scope
        ::Transaction::BudgetDetail.cash_flow.then do |scope|
          if future?
            scope.between(date_range)
          else
            scope.prior_to(last_date, include_pending: current?)
          end
        end
      end

      def non_cash_flow_budget_inclusion_scope
        ::Transaction::BudgetDetail
          .non_cash_flow
          .budget_inclusions
          .between(date_range, include_pending: current?)
      end
    end
  end
end
