module API
  module Budget
    module Interval
      class ShowSerializer < ApplicationSerializer
        attribute :discretionary, on_render: :render
        attribute :items, on_render: :render, each_serializer: ItemSerializer, alias_of: :item_objects
        attribute :data, on_render: :render

        def initialize(user_or_group, interval)
          @user_or_group = user_or_group
          super(interval)
        end

        def data
          DataSerializer.new(interval)
        end

        def discretionary
          DiscretionarySerializer.new(interval)
        end

        def item_objects
          interval.items.map(&:decorated).map do |item|
            {
              item: item,
              maturity_interval: upcoming_maturity_intervals.find(item.category_id),
            }
          end
        end

        private

        attr_reader :user_or_group

        def interval
          __getobj__
        end

        def upcoming_maturity_intervals
          @upcoming_maturity_intervals ||= ::Budget::UpcomingMaturityIntervalQuery.new(
            interval: interval
          ).call
        end
      end
    end
  end
end
