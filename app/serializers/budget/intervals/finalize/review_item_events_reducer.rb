module Budget
  module Intervals
    module Finalize
      class ReviewItemEventsReducer < SimpleDelegator
        def initialize(category, reviewable_items:, target_items:, interval:)
          super(category)
          @interval = interval
          @reviewable_items = reviewable_items
          @target_items = target_items
        end

        def events
          SerializableCollection.new { adjustment_events + create_events }
        end

        private

        def create_events
          case [monthly?, accrual?]
          when [true, false]
            collect_create_events { :add_item }
          else
            collect_create_events do |array_size|
              adjustment_events.size + array_size >= reviewable_items.size ? :skip_item : :add_item
            end
          end
        end

        def collect_create_events(&block)
          reviewable_items.each_with_object([]) do |item, array|
            array << CreateEventSerializer.new(item, interval: interval) if block.call(array.size) == :add_item
          end
        end

        def adjustment_events
          @adjustment_events ||= target_items.map { |item| AdjustEventSerializer.new(item) }
        end

        attr_reader :reviewable_items, :target_items, :interval
      end
    end
  end
end
