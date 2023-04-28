module Budget
  module Intervals
    module Finalize
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
                   :icon_class_name
        attribute :is_accrual, alias_of: :accrual?
        attribute :is_expense, alias_of: :expense?
        attribute :is_monthly, aliase_of: :monthly?
        attribute :upcoming_maturity_intervals, conditional: :accrual?, on_render: :render
        attribute :events, on_render: :render

        def upcoming_maturity_intervals
          SerializableCollection.new(serializer: MaturityIntervalSerializer) do
            maturity_intervals.on_or_after(month: month, year: year)
          end
        end

        def events
          ReviewItemEventsReducer.new(
            category,
            interval: interval,
            reviewable_items: reviewable_items,
            target_items: target_items,
          ).events
        end

        private

        def category
          __getobj__
        end

        delegate :month, :year, to: :interval

        attr_reader :base_items, :target_items, :interval
      end
    end
  end
end
