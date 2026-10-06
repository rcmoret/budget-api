module WebApp
  module Budget
    module Changes
      module Rollover
        module Query
          module Result
            class Simple
              include Alba::Resource

              Struct = Data.define(
                :category,
                :review_item,
                :adjustment,
                :target_event
              ) do
                delegate :key, :name, :slug, to: :category

                delegate :remaining, to: :review_item
                delegate :key, to: :review_item, prefix: true

                def item_attributes
                  {
                    key: review_item_key,
                    adjustment:,
                    remaining:,
                    event_key: target_event.key,
                    event_type: target_event.event_type,
                    target_item_budgeted: target_event.budgeted,
                  }
                end
              end

              def self.build_with_struct(
                category:,
                review_item:,
                target_event:,
                **kw_args
              )
                struct = Struct.new(
                  category:,
                  review_item:,
                  adjustment: kw_args[:adjustment],
                  target_event:
                )

                new(struct)
              end

              def self.with_create_event(
                category:,
                review_item:
              )
                build_with_struct(
                  category:,
                  review_item:,
                  target_event: TargetEvent.create_event
                )
              end

              def self.with_adjust_event(
                category:,
                review_item:,
                target_item:
              )
                build_with_struct(
                  category:,
                  review_item:,
                  target_event: TargetEvent.adjust_event(target_item)
                )
              end

              attributes :key, :name, :slug, :items, :target_events
              attribute(:is_accrual) { |struct| struct.category.accrual }
              attribute(:is_expense) { |struct| struct.category.expense }
              attribute(:is_monthly) { |struct| struct.category.monthly }

              def target_events(*)
                [ object.target_event.to_h ]
              end

              def items(*)
                ItemToItemSerializer.map(**object.item_attributes)
              end
            end
          end
        end
      end
    end
  end
end
