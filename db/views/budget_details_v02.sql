WITH event_type_ids AS (
  SELECT id, name IN ('rollover_extra_target_create', 'rollover_item_create', 'rollover_item_adjust') AS is_previous
  FROM budget_item_event_types
),
transaction_totals AS (
  SELECT
    budget_item_id,
    COUNT(*)     AS transaction_detail_count,
    SUM(amount)  AS transaction_detail_total
  FROM transaction_details
  GROUP BY budget_item_id
),
event_totals AS (
  SELECT
    e.budget_item_id,
    SUM(e.amount) FILTER (WHERE et.is_previous)     AS previously_budgeted,
    SUM(e.amount) FILTER (WHERE NOT et.is_previous) AS currently_budgeted
  FROM budget_item_events e
  JOIN event_type_ids et ON et.id = e.budget_item_event_type_id
  GROUP BY e.budget_item_id
)
SELECT
  i.*,
  bi.month
    AS month,
  bi.year
    AS year,
  c.key
    AS budget_category_key,
  c.name,
  c.expense,
  c.monthly,
  c.accrual,
  c.user_group_id,
  COALESCE(icons.class_name, '')
    AS icon_class_name,
  COALESCE(tt.transaction_detail_count, 0)
    AS transaction_detail_count,
  COALESCE(tt.transaction_detail_total, 0)
    AS transaction_detail_total,
  COALESCE(ev.previously_budgeted, 0)
    AS previously_budgeted,
  COALESCE(ev.currently_budgeted, 0)
    AS currently_budgeted,
  nm.maturity_month,
  nm.maturity_year,
  CASE
    WHEN c.monthly  THEN 'Budget::Details::Fixed'
    WHEN c.expense  THEN 'Budget::Details::VariableExpense'
    ELSE                 'Budget::Details::VariableRevenue'
  END AS type
FROM budget_items i
JOIN budget_categories c
  ON c.id = i.budget_category_id
LEFT JOIN icons
  ON c.icon_id = icons.id
JOIN budget_intervals bi
  ON bi.id = i.budget_interval_id
LEFT JOIN transaction_totals tt
  ON tt.budget_item_id = i.id
LEFT JOIN event_totals ev
  ON ev.budget_item_id = i.id
LEFT JOIN LATERAL (
  SELECT
    mi.month AS maturity_month,
    mi.year AS maturity_year
  FROM budget_category_maturity_intervals cmi
  JOIN budget_intervals mi ON mi.id = cmi.budget_interval_id
  WHERE cmi.budget_category_id = c.id
    AND (mi.year, mi.month) >= (bi.year, bi.month)
  ORDER BY mi.year ASC, mi.month ASC
  LIMIT 1
) nm ON true;
