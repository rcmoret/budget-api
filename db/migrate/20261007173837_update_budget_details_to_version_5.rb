class UpdateBudgetDetailsToVersion5 < ActiveRecord::Migration[7.0]
  def change
    update_view :budget_details, version: 5, revert_to_version: 4
  end
end
