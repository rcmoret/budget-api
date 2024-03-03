module API
  module Budget
    module Interval
      module SetUp
        class CreateEventSerializer < ApplicationSerializer
          include Mixins::BudgetEvents::CreateEvent

          def event_type
            ::Budget::EventTypes::SETUP_ITEM_CREATE
          end
        end
      end
    end
  end
end
