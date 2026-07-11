module WebApp
  module Transactions
    module Serializers
      class BudgetItemSerializer < GenericSerializer
        attributes :name,
          :key,
          :remaining

        attribute(:is_accrual, &:accrual?)
        attribute(:is_mature, &:mature?)
      end
    end
  end
end
