# frozen_string_literal: true

module WebApp
  module Transactions
    class DeleteController < BaseController
      include Mixins::HasRedirectParams
      include Mixins::HasAccount

      before_action -> { redirect_to(home_path) }, if: -> { transaction.nil? }

      def call
        transaction.destroy
        redirect_to redirect_path
      end

      private

      def transaction
        @transaction ||= account.transactions.by_key(params[:key])
      end

      def store_selected_account_path
        session[:selected_account_path] = redirect_path
      end
    end
  end
end
