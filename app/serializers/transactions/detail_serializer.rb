module Transactions
  class DetailSerializer < ApplicationSerializer
    attributes :key,
               :amount,
               :budget_item_key,
               :budget_category_key,
               :budget_category_name,
               :icon_class_name
    delegate :key, to: :budget_item, prefix: true
    delegate :key, :name, to: :budget_category, prefix: true
    delegate :icon_class_name, to: :budget_category

    def budget_category
      budget_item.category
    end
  end
end
