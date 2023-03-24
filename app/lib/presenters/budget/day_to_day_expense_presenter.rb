module Presenters
  module Budget
    class DayToDayExpensePresenter < BaseItemPresenter
      def remaining
        [difference, 0].min
      end
    end
  end
end
