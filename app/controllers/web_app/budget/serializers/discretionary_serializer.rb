# frozen_string_literal: true

module WebApp
  module Budget
    module Serializers
      class DiscretionarySerializer < GenericSerializer
        one :initial_amount,
          resource: MonetaryAmountSerializer
        one :over_under_budget,
          resource: MonetaryAmountSerializer
        one :remaining,
          resource: MonetaryAmountSerializer
        one :transactions_total,
          resource: MonetaryAmountSerializer
      end
    end
  end
end
