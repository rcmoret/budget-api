module WebApp
  module Budget
    module Changes
      module Rollover
        module Query
          module Result
            class Complex
              include Alba::Resource

              Struct = Data.define(
                :category,
                :review_items,
                :target_events
              ) do
                delegate :key, :name, :slug, to: :category

                def items_attributes
                  review_items.map do |item|
                    {
                      key: item.key,
                      adjustment: item.adjustment,
                      remaining: item.remaining,
                      event_key: item.event_key,
                      event_type: target_event_for(item).event_type,
                      target_item_budgeted: target_event_for(item).budgeted,
                    }
                  end
                end

                def target_event_for(review_item)
                  target_events.find do |event|
                    event.key == review_item.event_key
                  end || TargetEvent.rollover_none
                end
              end

              ReviewItem = Data.define(
                :key,
                :adjustment,
                :remaining,
                :event_key,
                :event_type,
                :target_item_budgeted
              )

              def self.build(
                category:,
                review_items:,
                target_items:
              )
                struct = Struct.new(
                  category:,
                  review_items: review_items.map do |item|
                    ReviewItem.new(
                      key: item.key,
                      remaining: item.remaining,
                      event_type: nil,
                      adjustment: nil,
                      event_key: nil,
                      target_item_budgeted: 0
                    )
                  end,
                  target_events: [
                    *target_items.map { |item| TargetEvent.adjust_event(item) },
                    *review_items.map { TargetEvent.create_event },
                  ]
                )

                new(struct)
              end

              def self.from_data(data)
                review_items = data.delete("items") || []
                target_events = data.delete("target_events") || []
                struct = Struct.new(
                  category:
                    ::Types::BudgetCategory.new.cast(category_data(data)),
                  review_items: review_items.map do |item|
                    ReviewItem.new(
                      **item.symbolize_keys.slice(*ReviewItem.members)
                    )
                  end,
                  target_events: target_events.map do |event|
                    TargetEvent.new_with_object(**event.symbolize_keys)
                  end
                )

                new(struct)
              end

              # The serialized flags are named like Setup's (is_accrual) but the
              # category type casts from the column names (accrual).
              def self.category_data(data)
                data.merge(
                  "accrual" => data["is_accrual"],
                  "expense" => data["is_expense"],
                  "monthly" => data["is_monthly"]
                ).compact
              end

              attributes :key,
                :name,
                :slug,
                :target_events,
                :items,
                :unreviewed,
                unapplied_amount: :money
              attribute(:is_accrual) { |struct| struct.category.accrual }
              attribute(:is_expense) { |struct| struct.category.expense }
              attribute(:is_monthly) { |struct| struct.category.monthly }

              def target_events(*)
                object.target_events.map(&:to_h)
              end

              def items(*)
                @items ||= ItemToItemSerializer.map(*object.items_attributes)
              end

              def unapplied_amount(*)
                Money.from_cents(
                  items.sum { |item| item.dig("unapplied_amount", "cents") }
                )
              end

              def unreviewed(*)
                items.any? { |item| !item["is_reviewed"] }
              end
            end
          end
        end
      end
    end
  end
end
