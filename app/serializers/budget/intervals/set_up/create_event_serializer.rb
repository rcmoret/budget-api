module Budget
  module Intervals
    module SetUp
      class CreateEventSerializer < ApplicationSerializer
        include Events::SharedCreateEvent

        def event_type
          EventTypes::SETUP_ITEM_CREATE
        end
      end
    end
  end
end
