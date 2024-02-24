module Budget
  module Intervals
    module Mixins
      module AvailableCash
        private

        def available_cash
          cash_flow_transaction_detail_scope
            .or(non_cash_flow_budget_inclusion_scope)
            .joins(:account)
            .merge(Account.belonging_to(user_group))
            .joins(:details)
            .sum(:amount)
        end

        def cash_flow_transaction_detail_scope
          Transaction::Entry.cash_flow.then do |scope|
            if future?
              scope.between(date_range)
            else
              scope.prior_to(last_date, include_pending: current?)
            end
          end
        end

        def non_cash_flow_budget_inclusion_scope
          Transaction::Entry
            .between(date_range, include_pending: current?)
            .where(
              budget_exclusion: false,
              account_id: Account.belonging_to(user_group).non_cash_flow.select(:id)
            )
        end
      end
    end
  end
end
