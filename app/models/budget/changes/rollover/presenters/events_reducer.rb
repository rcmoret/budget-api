module Budget
  module Changes
    class Rollover
      module Presenters
        # Reduces the rollover data model down to the events the EventsForm will
        # persist: every event the user actually adjusted (non-zero cents),
        # formatted for the form.
        class EventsReducer
          def initialize(change_set)
            @interval = change_set.interval
            @data_model = change_set.data_model
          end

          def events
            data_model.categories.flat_map do |category_data|
              category_data.events.reject(&:zero?).map do |event_data|
                attributes_for(category_data.key, event_data)
              end
            end
          end

          private

          def attributes_for(category_key, event_data)
            base_attributes_for(event_data).tap do |attrs|
              if event_data.create_event?
                attrs[:budget_item_key] = KeyGenerator.call
                attrs[:budget_category_key] = category_key
              else
                attrs[:budget_item_key] = event_data.budget_item_key
              end
            end
          end

          def base_attributes_for(event_data)
            {
              event_type: event_data.event_type,
              amount: event_data.updated_amount,
              month: interval.month,
              year: interval.year,
              data: {},
            }
          end

          attr_reader :data_model, :interval
        end
      end
    end
  end
end
