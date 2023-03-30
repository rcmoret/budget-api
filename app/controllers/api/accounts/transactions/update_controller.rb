module API
  module Accounts
    module Transactions
      class UpdateController < BaseController
        include HasTransactionEntry
        include UsesTransactionEntryForm

        def call
          if transaction_form.save
            render json: serializer.render, status: :accepted
          else
            render json: error_serializer.render, status: :unprocessable_entity
          end
        end

        private

        def accounts
          keys = [account_key, params.fetch(:transaction)[:accountKey]].compact.uniq
          return [account] if keys.one?

          Account.belonging_to(api_user).by_keys(keys)
        end

        def transaction_entry_permitted_params
          DEFAULT_TRANSACTION_ENTRY_PERMITTED_PARAMS.dup + %i[accountKey]
        end

        def transaction_details_permitted_params
          DEFAULT_TRANSACTION_DETAIL_PARAMS.dup + %i[_destroy]
        end
      end
    end
  end
end
