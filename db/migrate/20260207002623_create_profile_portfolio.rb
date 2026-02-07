class CreateProfilePortfolio < ActiveRecord::Migration[7.0]
  def change
    add_column :user_profiles,
      :about,
      :string,
      null: true,
      limit: 9999
  end
end
