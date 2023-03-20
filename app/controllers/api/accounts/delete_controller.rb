module API
  module Accounts
    class DeleteController < BaseController
      def call
        account.destroy
        case [account.errors.any?, archived?]
        in [false, true]
          render json: { account: serializer.render }, status: :accepted
        in [false, false]
          render json: NullObjectSerializer.new.render, status: :no_content
        else
          render json: account.errors.to_hash, status: :unprocessable_entity
        end
      end

      private

      def account
        @account ||= Account.fetch(user: api_user, key: key)
      end

      def key
        params.require(:key)
      end

      def archived?
        account.archived_at.present?
      end

      def serializer
        @serializer ||= User::AccountSerializer.new(account: account)
      end
    end
  end
end
