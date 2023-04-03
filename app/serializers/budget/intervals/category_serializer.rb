module Budget
  module Intervals
    class CategorySerializer < ApplicationSerializer
      attributes :key, :slug, :name, :default_amount
      attribute :is_accrual, alias_of: :accrual?
      attribute :is_expense, alias_of: :expense?
      attribute :is_monthly, alias_of: :monthly?
    end
  end
end
