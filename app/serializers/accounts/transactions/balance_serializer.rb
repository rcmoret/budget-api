module Accounts
  module Transactions
    class BalanceSerializer < ApplicationSerializer
      attribute :key
      attribute :balance
      attribute :balance_prior_to

      def initialize(account, interval:)
        super(account)
        @interval = interval
      end

      def balance_prior_to
        super(interval.first_date, include_pending: interval.future?)
      end

      private

      def account
        __getobj__
      end

      attr_reader :interval, :include_prior_balance
    end
  end
end
