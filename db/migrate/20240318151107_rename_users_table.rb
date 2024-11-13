class RenameUsersTable < ActiveRecord::Migration[7.0]
  def change
    rename_table :users, :user_profiles
  end
end
