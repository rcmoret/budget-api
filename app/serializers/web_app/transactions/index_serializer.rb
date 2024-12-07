module WebApp
  module Transactions
    class IndexSerializer < ApplicationSerializer
      attributes :key, :name, :slug, :priority, :balance, :balance_prior_to
      attribute :transactions, on_render: :render,
                               each_serializer: EntrySerializer,
                               alias_of: :account_transactions
      attribute :is_cash_flow, alias_of: :cash_flow?
      attribute :is_archived, alias_of: :deleted?
      attribute :archived_at, on_render: proc { |timestamp| render_date_time(timestamp) }
      attribute :metadata, on_render: :render

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

      def metadata
        Budget::DataSerializer.new(
          interval,
          item_ids
        )
      end

      attr_reader :interval

      private

      def account
        __getobj__
      end

      def item_ids
        transactions.flat_map do |transaction|
          transaction.details.filter_map(&:budget_item_id)
        end
      end
    end
  end
end
