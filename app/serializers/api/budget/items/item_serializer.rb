module API
  module Budget
    module Items
      class ItemSerializer < ApplicationSerializer
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

        delegate :accrual?,
                 :icon_class_name,
                 :expense?,
                 :monthly?,
                 :name,
                 :per_diem_enabled?,
                 to: :category

        def budget_category_key
          category.key
        end
      end
    end
  end
end
