class AddChangeIdToBudgetEvent < ActiveRecord::Migration[7.0]
  def change
    add_reference :budget_item_events,
                  :budget_change_set,
                  foreign_key: true,
                  null: true
  end
end
