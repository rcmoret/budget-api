class ChangeBudgetIntervalDatesToDate < ActiveRecord::Migration[7.0]
  def up
    change_column :budget_intervals,
      :start_date,
      :date,
      using: "(start_date AT TIME ZONE 'UTC')::date"
    change_column :budget_intervals,
      :end_date,
      :date,
      using: "(end_date AT TIME ZONE 'UTC')::date"
  end

  def down
    change_column :budget_intervals,
      :start_date,
      :datetime,
      precision: nil,
      using: "start_date::timestamp"
    change_column :budget_intervals,
      :end_date,
      :datetime,
      precision: nil,
      using: "end_date::timestamp"
  end
end
