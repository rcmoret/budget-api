module API
  module Accounts
    class UpdateController < BaseController
      include HasAccount

      def call
        if account.update(update_params)
          render json: serializer.render, status: :accepted
        else
          render json: errors_serializer.render, status: :unprocessable_entity
        end
      end

      private

      def update_params
        params
          .require(:account)
          .permit(
            :slug,
            :name,
            :cash_flow,
            :is_cash_flow,
            :priority,
            :archived_at
          )
      end

      def serializer
        IndividualSerializer.new(
          key: :account,
          serializable: ShowSerializer.new(account: account),
        )
      end

      def errors_serializer
        ErrorsSerializer.new(key: :account, model: account)
      end
    end
  end
end
