module WebApp
  module Budget
    module Interval
      module Finalize
        class CreateEventSerializer < ApplicationSerializer
          include Mixins::BudgetEvents::CreateEvent

          def event_type
            ::Budget::EventTypes::ROLLOVER_ITEM_CREATE
          end
        end
      end
    end
  end
end
