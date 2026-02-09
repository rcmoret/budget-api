module API
  module Accounts
    module Transactions
      class CreateController < BaseController
        include HasAccount
        include HasBudgetInterval
        include UsesTransactionEntryForm

        def call
          if transaction_form.save
            render json: serializer.render, status: :created
          else
            render json: error_serializer.render, status: :unprocessable_entity
          end
        end

        private

        def transaction_entry
          @transaction_entry ||= account.transactions.build
        end

        def accounts
          [ account ]
        end

        def transaction_entry_permitted_params
          DEFAULT_TRANSACTION_ENTRY_PERMITTED_PARAMS.dup + %i[key]
        end

        def transaction_details_permitted_params
          DEFAULT_TRANSACTION_DETAIL_PARAMS
        end
      end
    end
  end
end
