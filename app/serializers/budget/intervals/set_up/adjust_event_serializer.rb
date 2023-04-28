module Budget
  module Intervals
    module SetUp
      class AdjustEventSerializer < ApplicationSerializer
        include Events::SharedAdjustEvent

        def event_type
          EventTypes::SETUP_ITEM_ADJUST
        end
      end
    end
  end
end