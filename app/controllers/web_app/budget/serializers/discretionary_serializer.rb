# frozen_string_literal: true

module WebApp
  module Budget
    module Serializers
      class DiscretionarySerializer < ::Serializers::GenericSerializer
        attributes initial_amount: :money,
          over_under_budget: :money,
          remaining: :money,
          transactions_total: :money
      end
    end
  end
end
