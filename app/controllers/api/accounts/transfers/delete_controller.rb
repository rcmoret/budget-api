module API
  module Accounts
    module Transfers
      class DeleteController < BaseController
        include HasBudgetInterval

        before_action :lookup_transfer!

        def call
          if transfer.destroy
            render json: serializer.render, status: :accepted
          else
            render json: error_serializer.render, status: :unprocessable_entity
          end
        end

        private

        def serializer
          @serializer ||= API::Transactions::ResponseSerializer.new(
            deleted_transaction_keys: transfer.transaction_keys,
            accounts: transfer.transaction_accounts,
            interval: interval,
            transactions: [],
          )
        end

        def error_serializer
          @error_serializer ||= ErrorsSerializer.new(
            key: :transfer,
            model: transfer,
          )
        end

        def lookup_transfer!
          return if transfer.present?

          render json: { transfer: "not found" }, status: :not_found
        end

        def transfer
          @transfer ||= Transfer.fetch(api_user, key: transfer_key)
        end

        def transfer_key
          params.fetch(:transfer_key)
        end
      end
    end
  end
end
