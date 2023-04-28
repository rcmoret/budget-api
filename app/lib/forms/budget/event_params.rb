module Forms
  module Budget
    module EventParams
      PERMITTED = %i[
        amount
        budget_category_key
        budget_item_key
        data
        event_type
        key
        month
        year
      ].freeze
    end
  end
end
