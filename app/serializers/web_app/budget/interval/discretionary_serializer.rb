module WebApp
  module Budget
    module Interval
      class DiscretionarySerializer < ApplicationSerializer
        include Mixins::AvailableCash

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
            SerializableCollection.new(
              serializer: TransactionDetailSerializer
            ) do
              Transaction::Detail
                .includes(entry: %i[account credit_transfer debit_transfer])
                .belonging_to(user_group)
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
      end
    end
  end
end
