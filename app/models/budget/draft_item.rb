# frozen_string_literal: true

module Budget
  class DraftItem < SimpleDelegator
    def initialize(change)
      item = Item.find_or_initialize_by(
        key: change.budget_item_key,
        interval: change.interval,
        category_id: change.category_id,
      ).decorated
      item.events.build(amount: change.amount)
      super(item)
    end
  end
end
