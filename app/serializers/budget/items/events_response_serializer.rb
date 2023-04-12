module Budget
  module Items
    class EventsResponseSerializer < ApplicationSerializer
      def initialize(user:, interval:, budget_item_keys:)
        super(interval)
        @user = user
        @budget_item_keys = budget_item_keys
      end

      attribute :discretionary, on_render: :render
      attribute :items, on_render: :render

      def discretionary
        Intervals::DiscretionarySerializer.new(interval)
      end

      def items
        SerializableCollection.new(serializer: ItemSerializer) do
          Budget::Item
            .includes(transaction_details: { entry: :account }, events: :type, category: :icon)
            .fetch_collection(user: user, keys: budget_item_keys)
            .map(&:decorated)
        end
      end

      private

      def interval
        __getobj__
      end

      attr_reader :user, :budget_item_keys
    end
  end
end
