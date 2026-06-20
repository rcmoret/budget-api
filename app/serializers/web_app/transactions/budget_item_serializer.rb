module WebApp
  module Transactions
    class BudgetItemSerializer
      include Alba::Resource

      attributes :name,
        :key,
        :remaining

      attribute(:is_accrual, &:accrual?)
      attribute(:is_mature, &:mature?)

      transform_keys :lower_camel
    end
  end
end
