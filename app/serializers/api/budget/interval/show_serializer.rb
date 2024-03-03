module API
  module Budget
    module Interval
      class ShowSerializer < ApplicationSerializer
        include Mixins::SharedInterval

        attribute :categories, each_serializer: CategorySerializer, alias_of: :category_scope
        attributes :month, :year, :days_remaining, :total_days
        attribute :first_date, on_render: proc { |datestring| datestring.strftime("%F") }
        attribute :last_date, on_render: proc { |datestring| datestring.strftime("%F") }
        attribute :is_closed_out, alias_of: :closed_out?
        attribute :is_current, alias_of: :current?
        attribute :is_set_up, alias_of: :set_up?
        attribute :discretionary, on_render: :render
        attribute :items, on_render: :render, each_serializer: ItemSerializer, alias_of: :item_objects

        def initialize(user_or_group, interval)
          @user_or_group = user_or_group
          super(interval)
        end

        def category_scope
          ::Budget::Category.belonging_to(user_or_group)
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
