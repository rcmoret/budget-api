module API
  module Mixins
    module BudgetEvents
      module CreateEvent
        extend ActiveSupport::Concern

        def initialize(item, interval:)
          @interval = interval
          super(item)
        end

        included do
          attributes :name,
                     :amount,
                     :budget_category_key,
                     :budgeted,
                     :spent,
                     :budget_item_key,
                     :event_type,
                     :data
          attribute :key, alias_of: :event_key
        end

        def event_type
          raise NotImplementedError
        end

        def amount = 0

        def budgeted = budget_item.amount

        def budget_category_key = budget_item.category.key

        def budget_item_key
          @budget_item_key ||= SecureRandom.hex(6)
        end

        def event_key
          @event_key ||= SecureRandom.hex(6)
        end

        def data
          { "referencedFrom" => "budget item: #{budget_item.key}" }
        end

        private

        attr_reader :interval

        def budget_item
          __getobj__
        end
      end
    end
  end
end
