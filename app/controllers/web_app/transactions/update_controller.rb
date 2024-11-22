# frozen_string_literal: true

module WebApp
  module Transactions
    class UpdateController < BaseController
      include Mixins::UsesTransactionEntryForm
      before_action -> { redirect_to(home_path) }, if: -> { transaction.nil? }

      private

      def transaction
        @transaction ||= account.transactions.by_key(params[:key])
      end

      def permitted_parameters
        [
          :account_key,
          *BASE_TRANSACTION_ENTRY_PERMITTED_PARAMS,
          { details_attributes: [*BASE_TRANSACTION_DETAIL_PARAMS, :_destroy] },
        ]
      end
    end
  end
end
