# frozen_string_literal: true

module WebApp
  module Transactions
    class UpdateController < BaseController
      include Mixins::UsesTransactionEntryForm

      private

      def transaction
        # build
        # @transaction ||= account.transactions.by_key(params[:key])
      end

      def transaction_details_permitted_params
        BASE_TRANSACTION_DETAIL_PARAMS
      end

      def permitted_parameters
        BASE_TRANSACTION_ENTRY_PERMITTED_PARAMS.dup +
          [:key, { details_attributes: transaction_details_permitted_params }]
      end

      def namespace = "accounts"
    end
  end
end
