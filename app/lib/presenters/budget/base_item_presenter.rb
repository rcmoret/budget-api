# frozen_string_literal: true

module Presenters
  module Budget
    class BaseItemPresenter < SimpleDelegator
      def amount
        @amount ||= events.map(&:amount).sum
      end

      def spent
        @spent ||= transaction_details.map(&:amount).sum
      end

      def transaction_detail_count
        @transaction_detail_count ||= transaction_details.size
      end

      def difference
        @difference ||= amount - spent
      end

      def deletable?
        transaction_detail_count.zero?
      end
    end
  end
end
