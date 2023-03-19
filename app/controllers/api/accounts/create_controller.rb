module API
  module Accounts
    class CreateController < BaseController
      def call
        if account.save
          render json: { account: serializer.render }, status: :created
        else
          render json: account.errors.to_hash, status: :unprocessable_entity
        end
      end

      private

      def account
        @account ||= Account.belonging_to(api_user).build(create_params)
      end

      def create_params
        params
          .require(:account)
          .permit(
            :slug,
            :name,
            :cash_flow,
            :is_cash_flow,
            :priority,
            :key,
          )
      end

      def serializer
        User::AccountSerializer.new(account: account, balance: 0)
      end
    end
  end
end
