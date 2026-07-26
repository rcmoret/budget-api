module WebApp
  module Transactions
    module Serializers
      class BudgetItemSerializer < GenericSerializer
        attributes :name,
          :key
        one :remaining, resource: MonetaryAmountSerializer

        attribute(:is_accrual, &:accrual?)
        attribute(:is_mature, &:mature?)
      end
    end
  end
end
