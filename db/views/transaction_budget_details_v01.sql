SELECT
  td.*,
  te.clearance_date,
  (
    td.budget_item_id IS NOT NULL
    AND te.budget_exclusion = false
    AND te.id NOT IN (
      SELECT to_transaction_id FROM transfers
      UNION
      SELECT from_transaction_id FROM transfers
    )
  ) AS budget_inclusion,
  a.name AS account_name,
  a.id AS account_id,
  b.month,
  b.year,
  COALESCE(c.name, '') AS budget_category_name
FROM transaction_details td
JOIN transaction_entries te
  ON te.id = td.transaction_entry_id
JOIN accounts a
  ON a.id = te.account_id
LEFT JOIN budget_items bi
  ON bi.id = td.budget_item_id
LEFT JOIN budget_categories c
  ON c.id = bi.budget_category_id
LEFT JOIN budget_intervals b
  ON b.id = bi.budget_interval_id
