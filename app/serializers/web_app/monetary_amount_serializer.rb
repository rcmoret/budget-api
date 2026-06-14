# frozen_string_literal: true

module WebApp
  class MonetaryAmountSerializer
    include Alba::Resource

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
