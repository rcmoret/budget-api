# frozen_string_literal: true

module Budget
  module Intervals
    class DraftDiscretionarySerializer < ApplicationSerializer
      include SerializerMixins::AvailableCash

      attribute :amount
      attribute :over_under_budget

      def initialize(interval, items:)
        @items = items
        super(interval)
      end

      def amount
        items.map(&:remaining).sum + available_cash
      end

      def over_under_budget
        items.map(&:budget_impact).sum
      end

      private

      attr_reader :items
    end
  end
end
