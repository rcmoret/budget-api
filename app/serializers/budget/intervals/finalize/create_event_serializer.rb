module Budget
  module Intervals
    module Finalize
      class CreateEventSerializer < ApplicationSerializer
        include Events::SharedCreateEvent

        def event_type
          EventTypes::ROLLOVER_ITEM_CREATE
        end
      end
    end
  end
end
