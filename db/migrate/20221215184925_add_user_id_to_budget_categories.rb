class AddUserIdToBudgetCategories < ActiveRecord::Migration[7.0]
  def change
    add_reference :budget_categories, :user, foreign_key: true, null: true
  end
end
