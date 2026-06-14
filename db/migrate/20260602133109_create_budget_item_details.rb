class CreateBudgetItemDetails < ActiveRecord::Migration[7.0]
  def change
    create_view :budget_details
  end
end
