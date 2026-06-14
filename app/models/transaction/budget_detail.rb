module Transaction
  class BudgetDetail < ApplicationRecord
    include Scopes::Accounts
    include Scopes::ClearanceDate
    include BelongsToUserGroup::Through[:account]
    include HasKeyIdentifier
    include Fetchable

    belongs_to :budget_item,
      class_name: "Budget::Item",
      optional: true

    scope :budget_exclusions, -> { where(budget_inclusion: false) }
    scope :budget_inclusions, -> { where(budget_inclusion: true) }
    scope :for_budget_month, lambda { |budget_month|
      between(
        budget_month.date_range,
        include_pending: budget_month.current?
      )
    }
  end
end
