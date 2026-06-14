class CreateTransactionBudgetDetails < ActiveRecord::Migration[7.0]
  def change
    create_view :transaction_budget_details
  end
end
