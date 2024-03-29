module API
  module Accounts
    module Transactions
      class IndexController < BaseController
        include HasAccount
        include HasBudgetInterval

        def call
          render json: serializer.render, status: :ok
        end

        private

        def serializer
          @serializer ||= IndividualSerializer.new(
            key: :account,
            serializable: IndexSerializer.new(account: account, interval: interval)
          )
        end
      end
    end
  end
end
