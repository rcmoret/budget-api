# frozen_string_literal: true

module WebApp
  module Transactions
    module Serializers
      class IndexSerializer < SubjectSerializer
        many :budget_items, resource: BudgetItemSerializer
        one :budget_month, resource: BudgetMonthSerializer
        nested_attribute :featured_account do
          attribute(:key, &:featured_account_key)
          attribute(:name, &:featured_account_name)
          attribute(:slug, &:featured_account_slug)
          attributes(:edit_route)
          one :balance_prior_to, resource: MonetaryAmountSerializer
          many :transactions, resource: EntrySerializer
        end
      end
    end
  end
end
