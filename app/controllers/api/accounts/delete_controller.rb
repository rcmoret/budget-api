module API
  module Accounts
    class DeleteController < BaseController
      include HasAccount

      def call
        account.destroy
        case [account.errors.any?, archived?]
        in [false, true]
          render json: { account: serializer.render }, status: :accepted
        in [false, false]
          head :no_content
        else
          render json: account.errors.to_hash, status: :unprocessable_entity
        end
      end

      private

      def archived?
        account.archived_at.present?
      end

      def serializer
        @serializer ||= ShowSerializer.new(account: account)
      end
    end
  end
end
