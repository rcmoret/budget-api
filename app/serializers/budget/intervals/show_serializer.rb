module Budget
  module Intervals
    class ShowSerializer < ApplicationSerializer
      attribute :categories, on_render: :render
      attributes :month, :year, :days_remaining, :total_days
      attribute :first_date, on_render: proc { |datestring| datestring.strftime("%F") }
      attribute :last_date, on_render: proc { |datestring| datestring.strftime("%F") }
      attribute :is_closed_out, alias_of: :closed_out?
      attribute :is_current, alias_of: :current?
      attribute :is_set_up, alias_of: :set_up?
      attribute :discretionary, on_render: :render
      attribute :items, on_render: :render

      def initialize(user_or_group, interval)
        @user_or_group = user_or_group
        super(interval)
      end

      def categories
        SerializableCollection.new(serializer: CategorySerializer) do
          Category.belonging_to(user_or_group)
        end
      end

      def discretionary
        DiscretionarySerializer.new(interval)
      end

      def items
        SerializableCollection.new(serializer: ItemSerializer) { item_objects }
      end

      def total_days
        (last_date.to_date - first_date.to_date).to_i + 1
      end

      def days_remaining
        if current?
          [(last_date.to_date - Time.current.to_date + 1).to_i.abs, 1].max
        elsif past?
          0
        else
          total_days
        end
      end

      private

      attr_reader :user_or_group

      def interval
        __getobj__
      end

      def upcoming_maturity_intervals
        @upcoming_maturity_intervals ||= Budget::UpcomingMaturityIntervalQuery.new(
          interval: interval
        ).call
      end

      def item_objects
        interval.items.map(&:decorated).map do |item|
          {
            item: item,
            maturity_interval: upcoming_maturity_intervals.find(item.category_id),
          }
        end
      end
    end
  end
end
