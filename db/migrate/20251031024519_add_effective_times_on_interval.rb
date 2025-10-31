class AddEffectiveTimesOnInterval < ActiveRecord::Migration[7.0]
  def change
    add_column :budget_intervals,
      :effective_start,
      :datetime,
      null: true
  end
end
