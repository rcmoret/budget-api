module API
  module Mixins
    module BudgetEvents
      module AdjustEvent
        extend ActiveSupport::Concern

        included do
          attribute :amount, alias_of: :budgeted
          attributes :budget_item_key,
                     :budgeted,
                     :data,
                     :event_type,
                     :spent
          attribute :key, alias_of: :event_key
        end

        def event_type = raise NotImplementedError

        def budgeted = item.amount

        def data = {}

        def event_key
          @event_key ||= SecureRandom.hex(6)
        end

        def budget_item_key = item.key

        private

        def item = __getobj__
      end
    end
  end
end
