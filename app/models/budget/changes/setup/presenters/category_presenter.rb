module Budget
  module Changes
    class Setup
      module Presenters
        class CategoryPresenter < SimpleDelegator
          include NumericStringToCents
          include Items

          attr_reader :interval, :budget_items, :adjustments

          NEW_ADJUSTMENT = lambda { |item|
            { item.key => { display: "", cents: 0 } }
          }

          def initialize(category, interval:, keys:, adjustments: {})
            super(category)
            @interval = interval
            @budget_items = items.by_keys(keys)
            @adjustments = budget_items
                           .map(&NEW_ADJUSTMENT)
                           .reduce(adjustments, &:reverse_merge)
          end

          def events
            @events ||= adjustments.map do |item_key, adjustment|
              item = budget_items.find do |i|
                i.key == item_key
              end || category.items.build(key: item_key)

              event_presenter_for(item, adjustment:)
            end
          end

          def sum
            events.sum(&:updated_amount)
          end

          def unreviewed?
            events.any?(&:unreviewed?)
          end

          def reviewed?
            !unreviewed?
          end

          def upcoming_maturity_intervals
            maturity_intervals
              .on_or_after(month:, year:)
              .map(&:date_hash)
          end

          delegate :key, to: :category
          delegate :month, :year, to: :interval

          def event_presenter_for(item, adjustment:)
            if item.budget_interval_id == interval.id
              AdjustPresenter.new(item, adjustment:)
            else
              CreatePresenter.new(item, adjustment:)
            end
          end

          def self.hashify(...)
            new(...).to_h
          end

          def to_h
            Resources::CategoryResource.new(self).to_h
          end

          private

          def items
            category.items.where(interval: [ interval, interval.prev ])
          end

          def category
            __getobj__
          end
        end
      end
    end
  end
end
