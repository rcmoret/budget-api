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
          attributes :month,
                     :year,
                     :name,
                     :budget_category_key,
                     :icon_class_name,
                     :amount,
                     :budgeted,
                     :spent,
                     :budget_item_key,
                     :event_key,
                     :event_type,
                     :data
        end

        def budget_category_key
          category.key
        end

        def event_type
          raise NotImplementedError
        end

        def amount
          ""
        end

        def budgeted
          budget_item.amount
        end

        def budget_item_key
          @budget_item_key ||= SecureRandom.hex(6)
        end

        def event_key
          @event_key ||= SecureRandom.hex(6)
        end

        def data
          { "referencedFrom" => "budget item: #{budget_item.key}" }
        end

        delegate :month, :year, to: :interval

        private

        attr_reader :interval

        def budget_item
          __getobj__
        end
      end
    end
  end
end
