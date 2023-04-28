module Budget
  module Intervals
    module Events
      module SharedAdjustEvent
        extend ActiveSupport::Concern

        included do
          attributes :name,
                     :amount,
                     :budget_item_key,
                     :data,
                     :event_key,
                     :event_type,
                     :icon_class_name,
                     :spent
          attribute :budgeted, alias_of: :amount
        end

        def event_type
          raise NotImplementedError
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
      end
    end
  end
end
