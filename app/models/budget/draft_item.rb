# frozen_string_literal: true

module Budget
  class DraftItem < SimpleDelegator
    def initialize(interval:, budget_item_key:, budget_category_key:, amount:)
      item = Item.find_or_initialize_by(
        key: budget_item_key,
        interval: interval,
        category: Category.fetch(interval.user_group, key: budget_category_key)
      )
      item.events.build(amount: amount)
      super(item)
    end

    def amount
      events.sum(&:amount)
    end
  end
end
