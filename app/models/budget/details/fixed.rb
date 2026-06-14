module Budget
  module Details
    class Fixed < Base
      def cleared?
        transaction_detail_count.positive?
      end

      def remaining
        if transaction_detail_count.zero?
          amount
        else
          0
        end
      end

      def reviewable?
        deletable? && !remaining.zero?
      end

      def budget_impact
        return 0 if transaction_detail_count.zero?

        difference * -1
      end
    end
  end
end
