# frozen_string_literal: true

class CreateUserConfigurations < ActiveRecord::Migration[7.0]
  def change
    create_table :user_configurations do |t|
      t.references :user_profile, foreign_key: true, null: false
      t.references :user_configuration_option, foreign_key: true, null: false
      t.string :value, limit: 1000, null: false

      t.index %i[user_profile_id user_configuration_option_id],
        unique: true,
        name: :unique_config_option_on_profile
      t.timestamps
    end
  end
end
