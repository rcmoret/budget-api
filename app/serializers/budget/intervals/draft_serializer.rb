module Budget
  module Intervals
    class DraftSerializer < ApplicationSerializer
      attribute :discretionary, on_render: :render
      attribute :items, on_render: :render

      def initialize(interval, changes:)
        @changes = changes.map { |change| DraftItem.new(**change) }
        super(interval)
      end

      def discretionary
        DraftDiscretionarySerializer.new(interval, items: all_items)
      end

      def items
        SerializableCollection.new(serializer: LocalItemSerializer) { changes }
      end

      private

      attr_reader :changes

      def interval
        __getobj__
      end

      def all_items
        interval.items.reduce(new_items) do |collection, item|
          collection << (changes.find { |change| change.key == item.key } || item.decorated)
        end
      end

      def new_items
        changes.select(&:new_record?)
      end

      class LocalItemSerializer < ApplicationSerializer
        attributes :key,
                   :budget_category_key,
                   :name,
                   :amount,
                   :difference,
                   :remaining,
                   :spent

        def budget_category_key
          category.key
        end
      end
    end
  end
end
