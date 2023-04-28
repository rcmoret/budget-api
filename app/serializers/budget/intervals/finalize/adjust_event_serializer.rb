module Budget
  module Intervals
    module Finalize
      class AdjustEventSerializer < ApplicationSerializer
        include Events::SharedAdjustEvent

        def event_type
          EventTypes::ROLLOVER_ITEM_ADJUST
        end
      end
    end
  end
end
