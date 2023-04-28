module Budget
  module Intervals
    module Finalize
      class CategoriesSerializer < ApplicationSerializer
        attribute :first_date, on_render: proc { |timestamp| timestamp.strftime("%F") }
        attribute :last_date, on_render: proc { |timestamp| timestamp.strftime("%F") }
        attribute :budget_categories, on_render: :render

        def budget_categories
          SerializableCollection.new do
            category_scope.filter_map do |category|
              category_serializer(category) if reviewable_items_for(category).any?
            end
          end
        end

        private

        delegate :user_group, to: :interval

        def category_serializer(category)
          CategorySerializer.new(
            category,
            interval: target_interval,
            reviewable_items: reviewable_items_for(category),
            target_items: target_items_for(category),
          )
        end

        def category_scope
          @category_scope ||= budget_items.values.flatten.map(&:category)
        end

        def base_interval
          @base_interval ||= target_interval.prev
        end

        def budget_items
          @budget_items ||=
            Budget::Item
            .includes(:transaction_details, :events, category: { maturity_intervals: :interval })
            .belonging_to(user_group)
            .where(interval: [base_interval, target_interval])
            .map(&:decorated)
            .group_by(&:budget_interval_id)
        end

        def base_items
          @base_items ||= budget_items.fetch(base_interval.id) { [] }
        end

        def reviewable_items_for(category)
          base_items.select { |item| item.category == category && item.reviewable? }
        end

        def target_items
          @target_items ||= budget_items.fetch(target_interval.id) { [] }
        end

        def target_items_for(category)
          target_items.select { |item| item.category == category }
        end

        def target_interval
          __getobj__
        end
      end
    end
  end
end
