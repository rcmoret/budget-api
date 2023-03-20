module API
  module Accounts
    class UpdateController < BaseController
      def call
        if account.update(update_params)
          render json: serializer.render, status: :accepted
        else
          render json: errors_serializer.render, status: :unprocessable_entity
        end
      end

      private

      def account
        @account ||= Account.fetch(user: api_user, key: key)
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

      def serializer
        IndividualSerializer.new(
          key: :account,
          serializeable: User::AccountSerializer.new(account: account),
        )
      end

      def errors_serializer
        ErrorsSerializer.new(key: :account, model: account)
      end
    end
  end
end