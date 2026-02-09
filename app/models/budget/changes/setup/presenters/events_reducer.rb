module Budget
  module Changes
    class Setup
      module Presenters
        class EventsReducer
          def initialize(change_set)
            @interval = change_set.interval
            @data_model = change_set.data_model
          end

          def events
            categories.flat_map do |category_data|
              category_data.events.map do |event_data|
                attributes_for(category_data.key, event_data)
              end
            end
          end

          private

          def categories
            @categories ||=
              data_model.categories.filter_map do |category_data|
                events = category_data.events.select(&:non_zero?)

                next if events.empty?

                DataModel::CategoryStruct.new(
                  **category_data.to_h,
                  events:
                )
              end
          end

          def attributes_for(category_key, event_data)
            base_attributes_for(event_data).tap do |attrs|
              if event_data.create_event?
                attrs[:budget_item_key] = KeyGenerator.call
                attrs[:budget_category_key] = category_key
              else
                attrs[:budget_item_key] = event_data.budget_item_key
                if event_data.updated_amount.zero?
                  attrs[:event_type] =
                    EventTypes::SETUP_ITEM_DELETE
                end
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
