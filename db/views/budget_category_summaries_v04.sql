SELECT
  c.id as budget_category_id,
  intervals.month,
  intervals.year,
  SUM(CASE
    WHEN event_types.name IN ('rollover_extra_target_create', 'rollover_item_create', 'rollover_item_adjust')
    THEN events.amount
    ELSE 0
  END) as previously_budgeted,
  SUM(CASE
    WHEN event_types.name NOT IN ('rollover_extra_target_create', 'rollover_item_create', 'rollover_item_adjust')
    THEN events.amount
    ELSE 0
  END) as currently_budgeted,
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
JOIN budget_item_event_types event_types on event_types.id = events.budget_item_event_type_id
JOIN budget_intervals intervals on intervals.id = items.budget_interval_id
GROUP BY c.id, intervals.id
