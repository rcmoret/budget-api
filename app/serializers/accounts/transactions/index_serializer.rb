module Accounts
  module Transactions
    class IndexSerializer < ApplicationSerializer
      attributes :key, :name, :slug, :priority, :balance, :balance_prior_to
      attribute :transactions, on_render: :render,
                               each_serializer: ::Transactions::EntrySerializer,
                               alias_of: :account_transactions
      attribute :is_cash_flow, alias_of: :cash_flow?
      attribute :is_archived, alias_of: :deleted?
      attribute :archived_at, on_render: proc { |datetime| datetime&.strftime("%F") }
      attribute :budget, serializer: BudgetSerializer, alias_of: :interval

      def initialize(account:, interval:)
        super(account)
        @interval = interval
      end

      def account_transactions
        account
          .transactions
          .includes(
            :credit_transfer,
            :debit_transfer,
            receipt_attachment: :blob,
            details: { budget_item: { category: :icon } },
          )
          .between(interval.date_range, include_pending: interval.current?)
      end

      def balance_prior_to
        account.balance_prior_to(interval.first_date, include_pending: interval.future?)
      end

      attr_reader :interval

      private

      def account
        __getobj__
      end
    end
  end
end
