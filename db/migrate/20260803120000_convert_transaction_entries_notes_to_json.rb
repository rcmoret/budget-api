class ConvertTransactionEntriesNotesToJSON < ActiveRecord::Migration[7.0]
  def up
    add_column :transaction_entries, :notes_json, :json

    execute backfill_json_sql

    remove_column :transaction_entries, :notes
    rename_column :transaction_entries, :notes_json, :notes
  end

  def down
    add_column :transaction_entries, :notes_text, :text

    execute backfill_text_sql

    remove_column :transaction_entries, :notes
    rename_column :transaction_entries, :notes_text, :notes
  end

  private

  def backfill_json_sql
    <<~SQL.squish
      UPDATE transaction_entries
      SET notes_json = json_build_object(
        'type', 'doc',
        'content', (
          SELECT json_agg(json_build_object(
            'type', 'paragraph',
            'content', json_build_array(
              json_build_object('type', 'text', 'text', line)
            )
          ))
          FROM unnest(string_to_array(notes, E'\\n')) AS line
          WHERE btrim(line) <> ''
        )
      )
      WHERE notes IS NOT NULL AND btrim(notes) <> ''
    SQL
  end

  def backfill_text_sql
    <<~SQL.squish
      UPDATE transaction_entries
      SET notes_text = (
        SELECT string_agg(elem ->> 'text', E'\\n')
        FROM json_array_elements(notes -> 'content') AS para
        CROSS JOIN LATERAL json_array_elements(para -> 'content') AS elem
      )
      WHERE notes IS NOT NULL
    SQL
  end
end
