module Budget
  module Intervals
    module Finalize
      class CategorySerializer < ApplicationSerializer
        MaturityIntervalSerializer = Class.new(ApplicationSerializer) do
          attributes :month, :year
        end
        private_constant :MaturityIntervalSerializer

        def initialize(category, interval:, reviewable_items: [], target_items: [])
          super(category)
          @reviewable_items = reviewable_items
          @target_items = target_items
          @interval = interval
        end

        attributes :key,
                   :name,
                   :slug,
                   :icon_class_name
        attribute :is_accrual, alias_of: :accrual?
        attribute :is_expense, alias_of: :expense?
        attribute :is_monthly, alias_of: :monthly?
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

        attr_reader :reviewable_items, :target_items, :interval
      end
    end
  end
end
