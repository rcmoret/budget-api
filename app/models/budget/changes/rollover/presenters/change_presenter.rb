module Budget
  module Changes
    class Rollover
      module Presenters
        class ChangePresenter
          ITEM_INCLUDES = [
            :transaction_details,
            :events,
            {
              category: {
                maturity_intervals: :interval,
              },
            },
          ].freeze

          def initialize(interval:)
            @base_interval = interval
          end

          attr_reader :base_interval

          def categories
            budget_items.reduce(Set.new) do |set, item|
              next set if reviewable_items_for(item.category).none?

              category_presenter_for(item.category)
            end
          end

          private

          def category_presenter_for(category)
            CategoryPresenter.new(
              category,
              interval: target_interval,
              reviewable_items: reviewable_items_for(category),
              target_items: target_items_for(category),
            )
          end

          def budget_items
            @budget_items ||=
              ::Budget::Item
              .includes(*ITEM_INCLUDES)
              .where(interval: [ base_interval, target_interval ])
              .map(&:decorated)
          end

          def catergory_presenter(category)
            CategoryPresenter.new(
              category,
              interval:,
              keys: keys_for(category)
            )
          end

          def keys_for(category)
            budget_items.filter_map do |item|
              item.key if item.budget_category_id == category.id
            end
          end

          def target_interval
            @target_interval ||= base_interval.next
          end

          def base_items
            @base_items ||=
              budget_items
              .group_by(&:budget_interval_id)
              .fetch(base_interval.id) { [] }
          end

          def reviewable_items_for(category)
            base_items.select do |item|
              item.category == category && item.reviewable?
            end
          end

          def target_items_for(category)
            target_items.select { |item| item.category == category }
          end

          def target_items
            @target_items ||=
              budget_items
              .group_by(&:budget_interval_id)
              .fetch(target_interval.id) { [] }
          end
        end
      end
    end
  end
end
