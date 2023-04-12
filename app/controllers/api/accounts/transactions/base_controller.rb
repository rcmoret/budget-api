module API
  module Accounts
    module Transactions
      class BaseController < API::BaseController
        include HasAccount
        include HasBudgetInterval
      end
    end
  end
end
