# frozen_string_literal: true

module Budget
  class DraftItem < SimpleDelegator
    def initialize(interval:, budget_item_key:, category_id:, amount:)
      item = Item.find_or_initialize_by(
        key: budget_item_key,
        interval: interval,
        category_id: category_id,
      ).decorated
      item.events.build(amount: amount)
      super(item)
    end
  end
end
