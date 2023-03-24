module API
  module Accounts
    module Transactions
      class BaseController < API::BaseController
        include HasAccount
        include HasBudgetInterval

        private

        def account_key
          params.fetch(:account_key)
        end
      end
    end
  end
end
