module API
  module Mixins
    module BudgetEvents
      module AdjustEvent
        extend ActiveSupport::Concern

        included do
          attributes :amount,
                     :data,
                     :event_key,
                     :event_type,
                     :spent
          attribute :budgeted, alias_of: :amount
          attribute :budget_item_key, alias_of: :key
        end

        def event_type
          raise NotImplementedError
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
