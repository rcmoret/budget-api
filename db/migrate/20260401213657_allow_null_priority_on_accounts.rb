class AllowNullPriorityOnAccounts < ActiveRecord::Migration[7.0]
  def up
    change_column_null :accounts, :priority, true
  end

  def down
    change_column_null :accounts, :priority, false
  end
end
