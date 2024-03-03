module API
  module Budget
    module Interval
      class ItemSerializer < ApplicationSerializer
        def initialize(item_hash)
          @maturity_interval = item_hash.fetch(:maturity_interval)
          super(item_hash.fetch(:item))
        end

        attributes :key,
                   :budget_category_key,
                   :name,
                   :amount,
                   :difference,
                   :remaining,
                   :spent,
                   :icon_class_name
        attribute :is_accrual, alias_of: :accrual?
        attribute :is_deletable, alias_of: :deletable?
        attribute :is_expense, alias_of: :expense?
        attribute :is_monthly, alias_of: :monthly?
        attribute :is_per_diem_enabled, alias_of: :per_diem_enabled?
        attribute :maturity_month, conditional: :accrual?
        attribute :maturity_year, conditional: :accrual?
        attribute :transaction_detail_count

        delegate :name,
                 :accrual?,
                 :expense?,
                 :icon_class_name,
                 :monthly?,
                 :per_diem_enabled?,
                 to: :category

        def budget_category_key
          category.key
        end

        def transaction_detail_count
          transaction_details.size
        end

        def maturity_month
          maturity_interval.month
        end

        def maturity_year
          maturity_interval.year
        end

        private

        attr_reader :maturity_interval
      end
    end
  end
end
