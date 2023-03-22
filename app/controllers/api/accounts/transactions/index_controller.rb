module API
  module Accounts
    module Transactions
      class IndexController < BaseController
        before_action :render_interval_not_found, if: -> { interval.nil? || interval.invalid? }

        def call
          render json: serializer.render, status: :ok
        end

        private

        def serializer
          @serializer ||= IndividualSerializer.new(
            key: :account,
            serializeable: AccountTransactionsIndexSerializer.new(account: account, interval: interval)
          )
        end

        def interval
          @interval ||= Budget::Interval.fetch(user: api_user, key: { month: month, year: year })
        end

        def month
          params.fetch(:month)
        end

        def year
          params.fetch(:year)
        end

        def render_interval_not_found
          render json: { interval: "not found by month: #{month} and year: #{year}" }, status: :not_found
        end
      end
    end
  end
end
