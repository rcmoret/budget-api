module Budget
  module Changes
    class Setup
      module Resources
        class ItemResource
          include Alba::Resource

          attributes :amount,
            :budget_item_key,
            :event_type,
            :object_key,
            :spent,
            :updated_amount,
            :flags

          attribute :previously_budgeted,
            resource: WebApp::MonetaryAmountSerializer,
            &:previously_budgeted

          nested_attribute :adjustment do
            attribute :display, &:adjustment
            attribute :cents, &:adjustment_cents
          end
        end
      end
    end
  end
end
