# frozen_string_literal: true

module WebApp
  module Transactions
    class CreateController < BaseController
      include Mixins::UsesTransactionEntryForm

      private

      def transaction
        @transaction ||= account.transactions.build
      end

      def permitted_parameters
        [
          :key,
          *BASE_TRANSACTION_ENTRY_PERMITTED_PARAMS,
          { details_attributes: BASE_TRANSACTION_DETAIL_PARAMS },
        ]
      end

      def namespace = "accounts"
    end
  end
end
