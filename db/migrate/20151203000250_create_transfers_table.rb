# frozen_string_literal: true

class CreateTransfersTable < ActiveRecord::Migration[5.1]
  def change
    create_table :transfers do |t|
      t.integer :to_transaction_id, null: false
      t.integer :from_transaction_id, null: false

      t.timestamps
    end
  end
end
