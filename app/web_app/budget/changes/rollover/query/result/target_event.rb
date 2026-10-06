module WebApp
  module Budget
    module Changes
      module Rollover
        module Query
          module Result
            class TargetEvent
              include Alba::Resource
              include ::Serializers::MoneyConcern

              # budget_item_key is the upcoming item the event applies to: the
              # existing item for an adjust, a new item's key for a create.
              Struct =
                Data.define(:key, :event_type, :budgeted, :budget_item_key)

              attributes :key, :event_type, :budget_item_key

              def key(*) = object.key
              def event_type(*) = object.event_type
              def budget_item_key(*) = object.budget_item_key

              monetary_attributes :budgeted

              # Data stored before budget_item_key existed has none; finalizing
              # asks for a reset in that case.
              def self.new_with_object(budget_item_key: nil, **)
                new(Struct.new(budget_item_key:, **))
              end

              def self.adjust_event(target_item)
                new_with_object(
                  key: KeyGenerator.call,
                  event_type: ::Budget::EventTypes::ITEM_ADJUST,
                  budgeted: target_item.amount,
                  budget_item_key: target_item.key,
                )
              end

              def self.create_event
                new_with_object(
                  key: KeyGenerator.call,
                  event_type: ::Budget::EventTypes::ITEM_CREATE,
                  budgeted: 0,
                  budget_item_key: KeyGenerator.call,
                )
              end

              def self.rollover_none
                new_with_object(
                  key: "none",
                  event_type: nil,
                  budgeted: 0,
                )
              end
            end
          end
        end
      end
    end
  end
end
