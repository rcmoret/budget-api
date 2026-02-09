module WebApp
  module Budget
    module Interval
      module Finalize
        class CategorySerializer < ApplicationSerializer
          MaturityIntervalSerializer = Class.new(ApplicationSerializer) do
            attributes :month, :year
          end
          private_constant :MaturityIntervalSerializer

          ReviewItemSerializer = Class.new(ApplicationSerializer) do
            attributes :key, :remaining, :event_key, :rollover_amount

            def event_key = nil

            def rollover_amount
              return unless category.accrual?

              remaining
            end
          end

          def initialize(category, interval:, reviewable_items: [],
                         target_items: [])
            super(category)
            @reviewable_items = reviewable_items.map(&:decorated)
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
          attribute :upcoming_maturity_intervals,
            conditional: :accrual?,
            on_render: :render
          attribute :events, on_render: :render
          attribute :items, on_render: :render

          def upcoming_maturity_intervals
            SerializableCollection.new(
              serializer: MaturityIntervalSerializer
            ) do
              maturity_intervals.on_or_after(month:, year:)
            end
          end

          def events
            ReviewItemEventsReducer.new(
              category,
              interval:,
              reviewable_items:,
              target_items:,
            ).events
          end

          def items
            SerializableCollection.new(serializer: ReviewItemSerializer) do
              reviewable_items
            end
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
end
