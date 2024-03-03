module API
  module Accounts
    class IndexController < API::BaseController
      def call
        render json: IndexSerializer.new(api_user.accounts).render
      end
    end
  end
end
