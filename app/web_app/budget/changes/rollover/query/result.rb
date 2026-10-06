module WebApp
  module Budget
    module Changes
      module Rollover
        module Query
          module Result
            CategoryPresenter = Data.define(
              :representative,
              :review_items,
              :target_items
            ) do
              def identifiers
                {
                  accrual: representative.accrual?,
                  variable: !representative.monthly?,
                  review_item_count: review_items.length,
                  target_items_count: target_items.length,
                }
              end

              def target_item
                target_items.first
              end

              def review_item
                review_items.first
              end

              def category
                ::Types::BudgetCategory.new.cast(representative.attributes)
              end

              def to_h
                super
                  .except(:representative)
                  .merge(category:)
              end
            end

            def self.build_from_details(*)
              struct = CategoryPresenter.new(*)

              case struct.identifiers
              in { review_item_count: 1, target_items_count: 0 }
                Simple.with_create_event(
                  category: struct.category,
                  review_item: struct.review_item
                )
              in { accrual: true, target_items_count: 1 } |
                { variable: true, target_items_count: 1 }
                Simple.with_adjust_event(
                  category: struct.category,
                  review_item: struct.review_item,
                  target_item: struct.target_item
                )
              else
                Complex.build(**struct.to_h)
              end
            end
          end
        end
      end
    end
  end
end
