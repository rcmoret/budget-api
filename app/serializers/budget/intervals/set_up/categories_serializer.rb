module Budget
  module Intervals
    module SetUp
      class CategoriesSerializer < ApplicationSerializer
        attribute :first_date, on_render: proc { |timestamp| timestamp.strftime("%F") }
        attribute :last_date, on_render: proc { |timestamp| timestamp.strftime("%F") }
        attribute :budget_categories, on_render: :render

        def budget_categories
          SerializableCollection.new do
            category_scope.map do |category|
              CategorySerializer.new(
                category,
                interval: interval,
                base_items: base_items_for(category),
                target_items: target_items_for(category),
              )
            end
          end
        end

        private

        delegate :user_group, to: :interval

        def category_scope
          Category
            .includes(maturity_intervals: :interval)
            .belonging_to(user_group)
        end

        def base_interval
          @base_interval ||= interval.prev
        end

        def budget_items
          @budget_items ||=
            Budget::Item
            .includes(:transaction_details, :events)
            .belonging_to(user_group)
            .where(interval: [interval, base_interval])
            .map(&:decorated)
            .group_by(&:budget_interval_id)
        end

        def base_items
          @base_items ||= budget_items.fetch(base_interval.id) { [] }
        end

        def base_items_for(category)
          base_items.select { |item| item.category == category }
        end

        def target_items
          @target_items ||= budget_items.fetch(interval.id) { [] }
        end

        def target_items_for(category)
          target_items.select { |item| item.category == category }
        end

        def interval
          __getobj__
        end
      end
    end
  end
end
