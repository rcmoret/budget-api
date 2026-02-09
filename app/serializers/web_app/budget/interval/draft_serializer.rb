module WebApp
  module Budget
    module Interval
      class DraftSerializer < ApplicationSerializer
        attribute :discretionary, on_render: :render
        attribute :items, on_render: :render

        def initialize(interval, changes:)
          @changes = changes.map { |change| ::Budget::DraftItem.new(change) }
          super(interval)
        end

        def discretionary
          DraftDiscretionarySerializer.new(interval, items: all_items)
        end

        def items
          SerializableCollection.new(serializer: LocalItemSerializer) do
            changes
          end
        end

        private

        attr_reader :changes

        def interval
          __getobj__
        end

        def all_items
          interval.items.map do |item|
            changes.find { |change| change.key == item.key } || item.decorated
          end
        end

        class LocalItemSerializer < ApplicationSerializer
          attributes :key,
            :budget_category_key,
            :budget_category_name,
            :icon_class_name,
            :name,
            :amount,
            :difference,
            :remaining,
            :spent
          attribute :is_new_item, alias_of: :new_record?
          attribute :is_monthly, alias_of: :monthly?

          delegate :icon_class_name, to: :category

          def budget_category_name
            category.name
          end

          def budget_category_key
            category.key
          end
        end
      end
    end
  end
end
