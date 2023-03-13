class CreateAuthTokenContexts < ActiveRecord::Migration[7.0]
  def change
    create_table :auth_token_contexts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :key, limit: 12, null: false, index: { unique: true }
      t.string :ip_address, null: false, limit: 200
      t.datetime :expires_at, null: false
      t.datetime :manually_expired_at, null: true

      t.timestamps
    end
  end
end
