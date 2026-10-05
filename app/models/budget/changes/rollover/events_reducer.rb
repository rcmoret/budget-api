module Budget
  module Changes
    class Rollover
      # Turns the reviewed rollover data into the events the EventsForm saves,
      # all in the upcoming month. They're rollover event types so the
      # details view counts them as previously budgeted.
      class EventsReducer
        include EventTypes

        NONE_EVENT_KEY = "none".freeze

        def initialize(change_set)
          @data_model = change_set.data_model
          @upcoming = change_set.interval.next
        end

        def events
          [ *target_item_events, *unapplied_events ]
        end

        # Data stored before target events knew their item can't be applied.
        def missing_item_keys?
          events.any? { |event| event[:budget_item_key].blank? }
        end

        private

        attr_reader :data_model, :upcoming

        # One event per target event, summing every review item pointed at
        # it. Targets nothing points at, or that add up to zero, are skipped.
        def target_item_events
          data_model.categories.flat_map do |category|
            totals = adjustments_by_target(category)

            category.target_events.filter_map do |target|
              amount = totals[target["key"]]
              next if amount.nil? || amount.zero?

              target_item_event(category, target, amount)
            end
          end
        end

        def adjustments_by_target(category)
          category.items.each_with_object(Hash.new(0)) do |item, totals|
            target_key = item["event_key"]
            next if target_key.blank? || target_key == NONE_EVENT_KEY

            totals[target_key] += item.dig("adjustment", "cents").to_i
          end
        end

        # An adjust takes the item's new total; a create takes the amount.
        def target_item_event(category, target, amount)
          if target["event_type"] == ITEM_ADJUST
            budgeted = target.dig("budgeted", "cents").to_i
            event(ROLLOVER_ITEM_ADJUST, target["budget_item_key"],
              budgeted + amount)
          else
            event(ROLLOVER_ITEM_CREATE, target["budget_item_key"], amount)
              .merge(budget_category_key: category.key)
          end
        end

        def unapplied_events
          target = data_model.unapplied_target_event
          total = data_model.unapplied_total
          return [] if target.nil? || total.zero?

          [
            event(ROLLOVER_EXTRA_TARGET_CREATE, target["budget_item_key"],
              total.cents)
              .merge(budget_category_key: target["budget_category_key"]),
          ]
        end

        def event(event_type, budget_item_key, amount)
          {
            event_type:,
            budget_item_key:,
            amount:,
            month: upcoming.month,
            year: upcoming.year,
            data: {},
          }
        end
      end
    end
  end
end
