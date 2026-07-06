module Budget
  module Changes
    class Rollover
      module Presenters
        class ChangePresenter
          # Rollover rolls the base interval (the change set's interval) forward
          # into the target interval (base.next). Only reviewable base items
          # roll over; reviewability is determined by the Budget::Details::Base
          # subclasses (variable: remaining != 0, fixed: no transactions).
          def initialize(interval:, adjustments: {})
            @base_interval = interval
            @adjustments = adjustments
          end

          attr_reader :base_interval, :adjustments

          def categories
            reviewable_categories.map do |category|
              CategoryPresenter.new(
                category,
                interval: target_interval,
                items: items_for(category),
                adjustments:,
              )
            end
          end

          private

          # The reviewable base items plus every existing target-interval item
          # belonging to the category.
          def items_for(category)
            (reviewable_base_items + target_items).select do |item|
              item.budget_category_id == category.id
            end
          end

          def reviewable_categories
            category_scope.select do |category|
              reviewable_base_items.any? do |item|
                item.budget_category_id == category.id
              end
            end
          end

          def category_scope
            ::Budget::Category
              .includes(maturity_intervals: :interval)
              .where(id: detail_items.map(&:budget_category_id))
              .belonging_to(user_group)
          end

          def reviewable_base_items
            @reviewable_base_items ||= base_items.select(&:reviewable?)
          end

          def base_items
            detail_items.select do |item|
              item.budget_interval_id == base_interval.id
            end
          end

          def target_items
            @target_items ||= detail_items.select do |item|
              item.budget_interval_id == target_interval.id
            end
          end

          def detail_items
            @detail_items ||=
              ::Budget::Details::Base
              .includes(:events)
              .active
              .belonging_to(user_group)
              .where(interval: [ base_interval, target_interval ])
              .to_a
          end

          def target_interval
            @target_interval ||= base_interval.next
          end

          def user_group
            base_interval.user_group
          end
        end
      end
    end
  end
end
