module API
  module Budget
    module Interval
      module Finalize
        class AdjustEventSerializer < ApplicationSerializer
          include ::Budget::Intervals::Events::SharedAdjustEvent
          # include Events::SharedAdjustEvent

          def event_type
            ::Budget::EventTypes::ROLLOVER_ITEM_ADJUST
          end
        end
      end
    end
  end
end
