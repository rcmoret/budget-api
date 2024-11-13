# frozen_string_literal: true

class CreateUserConfigurationOptions < ActiveRecord::Migration[7.0]
  def change
    create_table :user_configuration_options do |t|
      t.string :description, null: false, limit: 200, index: { unique: true }
      t.string :default_value, null: false, limit: 1000

      t.timestamps
    end
  end
end
