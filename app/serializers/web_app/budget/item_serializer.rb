module WebApp
  module Budget
    class ItemSerializer < ApplicationSerializer
      def initialize(item_hash)
        @maturity_interval = item_hash.fetch(:maturity_interval)
        super(item_hash.fetch(:item))
      end

      attributes :key,
                 :name,
                 :amount,
                 :icon_class_name,
                 :maturity_month,
                 :maturity_year,
                 :month,
                 :remaining,
                 :year
      attribute :is_accrual, alias_of: :accrual?
      attribute :is_deleted, alias_of: :deleted?
      attribute :is_deletable, alias_of: :deletable?
      attribute :is_expense, alias_of: :expense?
      attribute :is_monthly, alias_of: :monthly?
      attribute :transaction_details, each_serializer: Transactions::DetailSerializer

      delegate :name,
               :accrual?,
               :expense?,
               :icon_class_name,
               :monthly?,
               to: :category

      def maturity_month
        maturity_interval.month
      end

      def maturity_year
        maturity_interval.year
      end

      delegate :month, :year, to: :interval

      private

      attr_reader :maturity_interval
    end
  end
end