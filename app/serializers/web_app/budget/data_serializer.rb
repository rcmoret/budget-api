module WebApp
  module Budget
    class DataSerializer < ApplicationSerializer
      include Mixins::SharedInterval

      attribute :items, on_render: :render
      attributes :month, :year, :days_remaining, :total_days
      attribute :first_date, on_render: proc { |timestamp|
        render_date_time(timestamp)
      }
      attribute :last_date, on_render: proc { |timestamp|
        render_date_time(timestamp)
      }
      attribute :is_current, alias_of: :current?

      def initialize(interval, item_ids)
        super(interval)
        @item_ids = item_ids
      end

      def items
        SerializableCollection.new(serializer: ItemSerializer) do
          items_query.map do |item|
            {
              item: item.decorated,
              maturity_interval:
                upcoming_maturity_intervals.find(item.category_id),
            }
          end
        end
      end

      private

      def items_query
        ::Budget::Item
          .where(id: @item_ids.compact)
          .or(interval.items)
      end

      def interval
        __getobj__
      end

      def upcoming_maturity_intervals
        @upcoming_maturity_intervals ||=
          ::Budget::UpcomingMaturityIntervalQuery.new(interval:).call
      end
    end
  end
end
