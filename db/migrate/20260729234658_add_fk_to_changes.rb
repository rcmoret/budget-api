class AddFkToChanges < ActiveRecord::Migration[7.0]
  def up
    change_column_null :budget_item_events,
      :budget_change_set_id,
      false
  end

  def down
    change_column_null :budget_item_events,
      :budget_change_set_id,
      true
  end
end
