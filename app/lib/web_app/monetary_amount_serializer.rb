# frozen_string_literal: true

module WebApp
  class MonetaryAmountSerializer < GenericSerializer
    include Comparable

    attribute(:display) do |amount|
      if amount.blank?
        ""
      else
        format("%.2f", amount / 100.0)
      end
    end

    attribute(:cents, &:itself)

    protected

    def <=>(other)
      cents <=> other.cents
    end
  end
end
