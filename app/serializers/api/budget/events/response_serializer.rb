module API
  module Budget
    module Events
      class ResponseSerializer < ApplicationSerializer
        def initialize(interval:, budget_item_keys:)
          super(interval)
          @budget_item_keys = budget_item_keys
        end

        attribute :discretionary, on_render: :render
        attribute :items, on_render: :render

        def discretionary
          Interval::DiscretionarySerializer.new(interval)
        end

        def items
          SerializableCollection.new(serializer: Items::ItemSerializer) do
            ::Budget::Item
              .includes(transaction_details: { entry: :account }, events: :type, category: :icon)
              .fetch_collection(interval.user_group, keys: budget_item_keys)
              .map(&:decorated)
          end
        end

        private

        def interval
          __getobj__
        end

        attr_reader :budget_item_keys
      end
    end
  end
end
