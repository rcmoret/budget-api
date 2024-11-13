module API
  module Budget
    module Interval
      module SetUp
        class AdjustEventSerializer < ApplicationSerializer
          include Mixins::BudgetEvents::AdjustEvent

          def event_type = ::Budget::EventTypes::SETUP_ITEM_ADJUST
        end
      end
    end
  end
end
