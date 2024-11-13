module API
  module Budget
    module Interval
      module Finalize
        class CategoriesSerializer < ApplicationSerializer
          attribute :first_date, on_render: proc { |timestamp| timestamp.strftime("%F") }
          attribute :last_date, on_render: proc { |timestamp| timestamp.strftime("%F") }
          attribute :budget_categories, on_render: :render

          def budget_categories
            SerializableCollection.new do
              categories.filter_map do |category|
                next if reviewable_items_for(category).none?

                category_serializer(category)
              end
            end
          end

          private

          def category_serializer(category)
            CategorySerializer.new(
              category,
              interval: target_interval,
              reviewable_items: reviewable_items_for(category),
              target_items: target_items_for(category),
            )
          end

          def categories
            @categories ||= budget_items.reduce(Set.new) { |set, item| set << item.category }
          end

          def base_interval
            @base_interval ||= target_interval.prev
          end

          def budget_items
            @budget_items ||=
              ::Budget::Item
              .includes(:transaction_details, :events, category: { maturity_intervals: :interval })
              .where(interval: [base_interval, target_interval])
              .map(&:decorated)
          end

          def base_items
            @base_items ||= budget_items.group_by(&:budget_interval_id).fetch(base_interval.id) { [] }
          end

          def reviewable_items_for(category)
            base_items.select { |item| item.category == category && item.reviewable? }
          end

          def target_items
            @target_items ||= budget_items.group_by(&:budget_interval_id).fetch(target_interval.id) { [] }
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
end
