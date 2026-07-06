module Budget
  module Changes
    class Rollover
      module Presenters
        class CategoryPresenter < SimpleDelegator
          include Items

          EMPTY_ADJUSTMENT = { display: "", cents: 0 }.freeze

          attr_reader :interval, :rollover_items, :adjustments

          def initialize(category, interval:, items: [], adjustments: {})
            super(category)
            @interval = interval
            @rollover_items = items
            @adjustments = adjustments
          end

          def events
            @events ||= single_event? ? Array(collapsed_event) : all_events
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

          def self.hashify(...)
            new(...).to_h
          end

          def to_h
            Resources::CategoryResource.new(self).to_h
          end

          private

          # Variable and fixed-accrual categories collapse to a single event:
          # an adjust when the item already exists in the upcoming (target)
          # interval, otherwise a create rolled forward from the base interval.
          def single_event?
            !category.monthly? || category.accrual?
          end

          def collapsed_event
            all_events.find(&:adjust?) || all_events.find(&:create?)
          end

          def all_events
            @all_events ||= rollover_items.map do |item|
              event_presenter_for(item)
            end
          end

          # Items already in the upcoming interval are adjusted; items rolling
          # forward from the base interval are created.
          def event_presenter_for(item)
            adjustment = adjustments.fetch(item.key, EMPTY_ADJUSTMENT)

            if item.budget_interval_id == interval.id
              AdjustPresenter.new(item, adjustment:)
            else
              CreatePresenter.new(item, adjustment:)
            end
          end

          def category
            __getobj__
          end
        end
      end
    end
  end
end
