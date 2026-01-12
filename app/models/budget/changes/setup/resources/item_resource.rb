module Budget
  module Changes
    class Setup
      module Resources
        class ItemResource
          include Alba::Resource

          attributes :amount,
                     :budget_item_key,
                     :event_type,
                     :flags,
                     :previously_budgeted,
                     :spent,
                     :updated_amount

          nested_attribute :adjustment do
            attribute :display, &:adjustment
            attribute :cents, &:adjustment_cents
          end
        end
      end
    end
  end
end
