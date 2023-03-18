module API
  module Accounts
    module Transactions
      class BaseController < API::BaseController
        before_action :render_account_not_found, if: -> { account.nil? }

        private

        def render_account_not_found
          render json: { account: "not found by key: #{account_key}" }, status: :not_found
        end

        def account
          @account ||= Account.fetch(user: api_user, key: account_key)
        end

        def account_key
          params.fetch(:account_key)
        end
      end
    end
  end
end
