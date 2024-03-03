module API
  module Transactions
    class DetailSerializer < ApplicationSerializer
      attributes :key,
                 :amount,
                 :budget_item_key,
                 :budget_category_name,
                 :icon_class_name
      delegate :key, to: :budget_item, prefix: true, allow_nil: true
      delegate :name, to: :budget_category, prefix: true, allow_nil: true
      delegate :icon_class_name, to: :budget_category, allow_nil: true

      private

      def budget_category
        budget_item&.category
      end
    end
  end
end
