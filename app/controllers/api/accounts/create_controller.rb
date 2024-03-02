module API
  module Accounts
    class CreateController < BaseController
      def call
        if account.save
          render json: serializer.render, status: :created
        else
          render json: errors_serializer.render, status: :unprocessable_entity
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
        IndividualSerializer.new(
          key: :account,
          serializable: ::Accounts::ShowSerializer.new(account: account),
        )
      end

      def errors_serializer
        ErrorsSerializer.new(key: :account, model: account)
      end
    end
  end
end
