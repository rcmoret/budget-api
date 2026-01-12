class CreateBudgetChanges < ActiveRecord::Migration[7.0]
  def change
    create_table :budget_change_sets do |t|
      t.references :budget_interval

      t.integer :type_key, null: false
      t.string :key,
        limit: 12,
        index: { unique: true },
        null: false
      t.timestamp :effective_at, null: true
      t.json :events_data, default: {}
      t.string :type, **{
        as: case_statment do |key:, type:|
          "WHEN type_key = #{key} THEN 'Budget::Changes::#{type.to_s.classify}'"
        end,
        stored: true
      }

      t.timestamps
    end
  end

  def case_statment
    <<-SQL
      CASE
        #{Budget::ChangeSet::TYPE_MAP.map{ yield(**_1) }.join("\n")}
      ELSE 'Undetermined'
      END
    SQL
  end
end
