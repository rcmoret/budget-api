module WebApp
  module Transactions
    class IndexSerializer < PageSerializer
      many :budget_items, resource: BudgetItemSerializer
      one :budget_month, resource: BudgetMonthSerializer
      nested_attribute :featured_account do
        attribute(:key, &:featured_account_key)
        attribute(:name, &:featured_account_name)
        attribute(:slug, &:featured_account_slug)
        one :balance_prior_to, resource: MonetaryAmountSerializer
        many :transactions, resource: EntrySerializer

        transform_keys :lower_camel
      end

      transform_keys :lower_camel
    end
  end
end
