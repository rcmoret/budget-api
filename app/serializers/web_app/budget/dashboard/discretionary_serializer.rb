# frozen_string_literal: true

module WebApp
  module Budget
    module Dashboard
      class DiscretionarySerializer
        include Alba::Resource

        one :initial_amount, resource: MonetaryAmountSerializer
        one :over_under_budget, resource: MonetaryAmountSerializer
        one :remaining, resource: MonetaryAmountSerializer
        one :transactions_total, resource: MonetaryAmountSerializer

        transform_keys :lower_camel
      end
    end
  end
end
