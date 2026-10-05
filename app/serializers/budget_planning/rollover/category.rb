module Serializers
  module BudgetPlanning
    module Rollover
      class Category
        include Alba::Resource

        Struct = Data.define(:category, :review_items, :target_events) do
          delegate :key, :name, :slug, to: :category
        end

        def self.build_with(...)
          new(Struct.new(...))
        end

        def self.from_hash(data)
          target_events = data.delete("target_events") || []
          review_items = data.delete("review_items") || []

          build_with(
            category: Types::BudgetCategory.new.cast(data),
            review_items: data["review_items"],
            target_events: target_events.map do |event|
              Budget::Changes::Rollover::Query::Result::TargetEvent
                .new(event)
            end
          )
        end

        def self.map_items(review_items, target_events)
          review_items.map do |item|
            {
              key: item.key,
              event_key: item.event_key,
              adjustment: item.adjustment,
              remaining: item.remaining
            }
          end
        end

        attributes :key, :name, :slug, :items, :target_events
      end
    end
  end
end
