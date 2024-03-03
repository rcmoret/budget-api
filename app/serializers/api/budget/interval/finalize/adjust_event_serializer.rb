module API
  module Budget
    module Interval
      module Finalize
        class AdjustEventSerializer < ApplicationSerializer
          include Mixins::BudgetEvents::AdjustEvent

          def event_type
            ::Budget::EventTypes::ROLLOVER_ITEM_ADJUST
          end
        end
      end
    end
  end
end
