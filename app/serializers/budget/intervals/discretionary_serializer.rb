module Budget
  module Intervals
    class DiscretionarySerializer < ApplicationSerializer
      attribute :amount
      attribute :over_under_budget
      attribute :transaction_details, on_render: :render
      attribute :transactions_total

      def amount
        items.map(&:remaining).sum + available_cash
      end

      def over_under_budget
        items.map(&:budget_impact).sum
      end

      def transaction_details
        @transaction_details ||=
          SerializableCollection.new(serializer: TransactionDetailSerializer) do
            Transaction::Detail
              .includes(entry: %i[account credit_transfer debit_transfer])
              .discretionary
              .budget_inclusions
              .between(date_range, include_pending: current?)
              .reject(&:transfer?)
          end
      end

      def transactions_total
        transaction_details.map(&:amount).sum
      end

      private

      def items
        super.map(&:decorated)
      end

      def available_cash
        cash_flow_transaction_detail_scope
          .or(non_cash_flow_budget_inclusion_scope)
          .joins(:account)
          .merge(Account.where(user_group: user_group))
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
            account_id: Account.where(user_group: user_group).non_cash_flow.pluck(:id)
          )
      end
    end
  end
end
