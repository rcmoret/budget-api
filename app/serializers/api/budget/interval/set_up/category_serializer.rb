module API
  module Budget
    module Interval
      module SetUp
        class CategorySerializer < ApplicationSerializer
          def initialize(category, interval:, base_items: [], target_items: [])
            @base_items = base_items
            @target_items = target_items
            @interval = interval
            super(category)
          end

          attributes :key,
                     :name,
                     :slug,
                     :default_amount,
                     :icon_class_name
          attribute :is_accrual, alias_of: :accrual?
          attribute :is_expense, alias_of: :expense?
          attribute :is_monthly, aliase_of: :monthly?
          attribute :upcoming_maturity_intervals, conditional: :accrual?, on_render: :render
          attribute :events, on_render: :render

          def upcoming_maturity_intervals
            SerializableCollection.new(serializer: MaturityIntervalSerializer) do
              category.maturity_intervals.on_or_after(month: month, year: year)
            end
          end

          def events
            SerializableCollection.new do
              existing_item_events + new_item_events
            end
          end

          MaturityIntervalSerializer = Class.new(ApplicationSerializer) do
            attributes :month, :year
          end

          private

          def category = __getobj__

          def existing_item_events
            @existing_item_events ||= target_items.map do |item|
              AdjustEventSerializer.new(item)
            end
          end

          def new_item_events
            @new_item_events ||= base_items.filter_map do |item|
              next if category.weekly? && existing_item_events.any?

              CreateEventSerializer.new(item, interval: interval)
            end
          end

          delegate :month, :year, to: :interval

          attr_reader :base_items, :target_items, :interval
        end
      end
    end
  end
end
