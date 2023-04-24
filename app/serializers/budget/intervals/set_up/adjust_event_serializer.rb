module Budget
  module Intervals
    module SetUp
      class AdjustEventSerializer < ApplicationSerializer
        include EventTypes

        attributes :name,
                   :amount,
                   :budget_item_key,
                   :data,
                   :event_key,
                   :event_type,
                   :icon_class_name,
                   :spent
        attribute :budgeted, alias_of: :amount

        def event_type
          SETUP_ITEM_ADJUST
        end

        def budget_item_key
          key
        end

        def event_key
          @event_key ||= SecureRandom.hex(6)
        end

        def data
          {}
        end

        def item
          __getobj__
        end
      end
    end
  end
end
