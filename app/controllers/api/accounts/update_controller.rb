module API
  module Accounts
    class UpdateController < BaseController
      def call
        if account.update(update_params)
          render json: { account: serializer.render }, status: :accepted
        else
          render json: account.errors.to_hash, status: :unprocessable_entity
        end
      end

      private

      def account
        @account ||= Account.fetch(user: api_user, identifier: key)
      end

      def update_params
        params
          .require(:account)
          .permit(
            :slug,
            :name,
            :cash_flow,
            :is_cash_flow,
            :priority,
          )
      end

      def key
        params.require(:key)
      end

      def serializer
        @serializer ||= User::AccountSerializer.new(account: account, balance: account.balance)
      end
    end
  end
end
