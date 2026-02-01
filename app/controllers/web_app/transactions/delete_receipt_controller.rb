# frozen_string_literal: true

module WebApp
  module Transactions
    class DeleteReceiptController < BaseController
      include Mixins::HasRedirectParams
      include Mixins::HasAccount

      before_action -> { redirect_to(home_path) }, if: -> { transaction.nil? }

      def call
        transaction.receipt.purge if transaction.receipt.attached?
        redirect_to redirect_path
      end

      private

      def transaction
        @transaction ||= account.transactions.by_key(params[:key])
      end
    end
  end
end
