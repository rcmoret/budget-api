# frozen_string_literal: true

module WebApp
  module Budget
    class EditSerializer < ApplicationSerializer
      attribute :discretionary, on_render: :render
      attribute :items,
                on_render: :render,
                each_serializer: API::Budget::Interval::ItemSerializer,
                alias_of: :item_objects
      attribute :data, on_render: :render
      attribute :draft, on_render: :render
      attribute :categories, on_render: :render

      def initialize(user_or_group, interval:, changes:)
        @user_or_group = user_or_group
        @changes = changes
        super(interval)
      end

      def data
        API::Budget::Interval::DataSerializer.new(interval)
      end

      def discretionary
        API::Budget::Interval::DiscretionarySerializer.new(interval)
      end

      def categories
        SerializableCollection.new(serializer: API::Budget::Interval::CategorySerializer) do
          ::Budget::Category.belonging_to(user_or_group)
        end
      end

      def item_objects
        interval.items.map(&:decorated).map do |item|
          {
            item: item,
            maturity_interval: upcoming_maturity_intervals.find(item.category_id),
          }
        end
      end

      def draft
        API::Budget::Interval::DraftSerializer.new(interval, changes: changes)
      end

      private

      attr_reader :user_or_group, :changes

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
