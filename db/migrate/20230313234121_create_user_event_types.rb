class CreateUserEventTypes < ActiveRecord::Migration[7.0]
  def change
    create_table :user_event_types do |t|
      t.string :name, limit: 100, null: false, index: { unique: true }

      t.timestamps
    end
  end
end
