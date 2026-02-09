module API
  module Budget
    module Interval
      module Finalize
        class CategoriesSerializer < ApplicationSerializer
          attribute :first_date, on_render: proc { |timestamp| render_date_time(timestamp) }
          attribute :last_date, on_render: proc { |timestamp| render_date_time(timestamp) }
          attribute :categories, on_render: :render
          attribute :data, on_render: :render
          attribute :target, on_render: :render

          def categories
            SerializableCollection.new do
              budget_items.reduce(Set.new) do |set, item|
                set << item.category
              end.filter_map do |category|
                next if reviewable_items_for(category).none?

                category_serializer(category)
              end
            end
          end

          def data
            DataSerializer.new(base_interval)
          end

          def target
            DataSerializer.new(target_interval)
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

          def base_interval
            __getobj__
          end

          def budget_items
            @budget_items ||=
              ::Budget::Item
              .includes(:transaction_details, :events, category: { maturity_intervals: :interval })
              .where(interval: [ base_interval, target_interval ])
              .map(&:decorated)
          end

          def base_items
            @base_items ||= budget_items.group_by(&:budget_interval_id).fetch(base_interval.id) do
              []
            end
          end

          def reviewable_items_for(category)
            base_items.select { |item| item.category == category && item.reviewable? }
          end

          def target_items
            @target_items ||=
              budget_items.group_by(&:budget_interval_id).fetch(target_interval.id) do
                []
              end
          end

          def target_items_for(category)
            target_items.select { |item| item.category == category }
          end

          def target_interval
            base_interval.next
          end
        end
      end
    end
  end
end
