module API
  module Accounts
    module Transactions
      class DeleteController < BaseController
        include HasTransactionEntry

        def call
          if transaction_entry.destroy
            render json: serializer.render, status: :accepted
          else
            render json: error_serializer.render, status: :unprocessable_entity
          end
        end

        private

        def serializer
          ::Transactions::ResponseSerializer.new(
            accounts: [account],
            transactions: [],
            interval: interval,
            deleted_transaction_keys: [transaction_entry.key],
            budget_items: transaction_entry.budget_items
          )
        end

        def error_serializer
          @error_serializer ||= ErrorsSerializer.new(
            key: :transaction,
            model: transaction_entry,
          )
        end
      end
    end
  end
end
