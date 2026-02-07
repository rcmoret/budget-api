class CreatePortfolioItems < ActiveRecord::Migration[7.0]
  def change
    create_table :portfolio_items do |t|
      t.references :user_profile, null: false, foreign_key: true
      t.string :title, null: false, default: "", limit: 40
      t.string :description, null: false, default: "", limit: 400
      t.string :key, limit: 12, null: false

      t.timestamps
    end

    add_index :portfolio_items, :key, unique: true
  end
end
