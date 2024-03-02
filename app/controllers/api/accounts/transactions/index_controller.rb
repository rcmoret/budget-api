module API
  module Accounts
    module Transactions
      class IndexController < BaseController
        def call
          render json: serializer.render, status: :ok
        end

        private

        def serializer
          @serializer ||= IndividualSerializer.new(
            key: :account,
            serializable: ::Accounts::Transactions::IndexSerializer.new(account: account, interval: interval)
          )
        end
      end
    end
  end
end
