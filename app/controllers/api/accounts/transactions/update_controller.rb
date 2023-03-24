module API
  module Accounts
    module Transactions
      class UpdateController < BaseController
        include UsesTransactionEntryForm

        before_action :insure_transaction_found

        def call
          if transaction_form.save
            render json: serializer.render, status: :accepted
          else
            render json: error_serializer.render, status: :unprocessable_entity
          end
        end

        private

        def transaction_entry
          @transaction_entry ||= Transaction::Entry.fetch(user: api_user, key: key)
        end

        def key
          params.fetch(:key)
        end

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

        def insure_transaction_found
          return if transaction_entry.present?

          render json: { transaction: "not found by key: #{key}" }, status: :not_found
        end
      end
    end
  end
end
