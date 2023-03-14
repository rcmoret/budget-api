class CreateUserEvents < ActiveRecord::Migration[7.0]
  def change
    create_table :user_events do |t|
      t.references :actor, null: false, foreign_key: { to_table: :users }
      t.references :target_user, null: false, foreign_key: { to_table: :users }
      t.references :user_event_type, null: false, foreign_key: true
      t.string :key, null: false, index: { unique: true }, limit: 12
      t.json :data, default: {}

      t.timestamps
    end
  end
end
