module Presenters
  module Budget
    class MonthlyItemPresenter < BaseItemPresenter
      def remaining
        if transaction_detail_count.zero?
          amount
        else
          0
        end
      end
    end
  end
end
