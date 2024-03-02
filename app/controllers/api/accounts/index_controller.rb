module API
  module Accounts
    class IndexController < API::BaseController
      def call
        render json: serializer.render
      end

      private

      def serializer
        ::Accounts::IndexSerializer.new(api_user.accounts)
      end
    end
  end
end
