class AddNotesToBudgetChangeSets < ActiveRecord::Migration[7.0]
  def change
    add_column :budget_change_sets, :notes, :json
  end
end
