module WebApp
  module Transactions
    class BudgetItemSerializer < ::Serializers::GenericSerializer
      attributes :name,
        :key
      attributes remaining: :money

      attribute(:is_accrual, &:accrual?)
      attribute(:is_fixed, &:monthly?)
      attribute(:is_mature, &:mature?)
    end
  end
end
