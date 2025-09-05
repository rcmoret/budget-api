SELECT
  c.id as budget_category_id,
  intervals.month,
  intervals.year,
  SUM(events.amount) as budgeted,
  COALESCE((
    SELECT SUM(td.amount)
    FROM transaction_details td
    WHERE td.budget_item_id IN
    (SELECT id
      FROM budget_items
      WHERE budget_category_id = c.id
      AND budget_interval_id = intervals.id)
  ), 0) as transactions_total
FROM budget_categories c
JOIN budget_items items on items.budget_category_id = c.id
JOIN budget_item_events events on events.budget_item_id = items.id
JOIN budget_intervals intervals on intervals.id = items.budget_interval_id
GROUP BY c.id, intervals.id
