# frozen_string_literal: true

module API
  module Budget
    module Interval
      class DraftDiscretionarySerializer < ApplicationSerializer
        include Mixins::AvailableCash

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
end
