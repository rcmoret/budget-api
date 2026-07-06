class UpdateTransactionBudgetDetailsToVersion2 < ActiveRecord::Migration[7.0]
  def change
    update_view :transaction_budget_details, version: 2, revert_to_version: 1
  end
end
