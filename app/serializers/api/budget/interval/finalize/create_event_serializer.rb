module API
  module Budget
    module Interval
      module Finalize
        class CreateEventSerializer < ApplicationSerializer
          include ::Budget::Intervals::Events::SharedCreateEvent
          # include ::Budget::Events::SharedCreateEvent

          def event_type
            ::Budget::EventTypes::ROLLOVER_ITEM_CREATE
          end
        end
      end
    end
  end
end
