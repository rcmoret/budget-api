# frozen_string_literal: true

class CreateAccounts < ActiveRecord::Migration[5.1]
  def change
    create_table :accounts do |t|
      t.string  :name, null: false
      t.boolean :cash_flow, default: true
      t.integer :priority, null: false
      t.timestamp :archived_at

      t.timestamps
    end
  end
end
