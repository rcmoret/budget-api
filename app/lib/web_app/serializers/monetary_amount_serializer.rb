# frozen_string_literal: true

module WebApp
  module Serializers
    class MonetaryAmountSerializer < GenericSerializer
      attribute(:display) do |amount|
        if amount.blank?
          ""
        else
          format("%.2f", amount / 100.0)
        end
      end

      attribute(:cents, &:itself)
    end
  end
end
