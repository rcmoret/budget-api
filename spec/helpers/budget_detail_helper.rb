module BudgetDetailHelper
  # Builds an in-memory Budget::Details record (the subclass the view would
  # pick for the category) without creating items, events or transactions.
  # Category and interval can be built or created; any view column can be
  # overridden through attributes.
  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def build_detail(category:, interval:, **attributes)
    detail_class =
      if category.monthly?
        Budget::Details::Fixed
      elsif category.expense?
        Budget::Details::VariableExpense
      else
        Budget::Details::VariableRevenue
      end

    previously_budgeted = attributes.fetch(:previously_budgeted, 0)
    currently_budgeted = attributes.fetch(:currently_budgeted, 0)
    transaction_detail_total = attributes.fetch(:transaction_detail_total, 0)
    budgeted = previously_budgeted + currently_budgeted

    detail_class.new(
      id: rand(1..100_000),
      key: KeyGenerator.call,
      created_at: 5.minutes.ago,
      updated_at: 2.minutes.ago,
      deleted_at: nil,
      budget_category_id: category.id,
      budget_category_key: category.key,
      budget_category_slug: category.slug,
      name: category.name,
      expense: category.expense?,
      monthly: category.monthly?,
      accrual: category.accrual,
      default_amount: category.default_amount,
      icon_class_name: "",
      budget_interval_id: interval.id,
      month: interval.month,
      year: interval.year,
      user_group_id: interval.user_group_id,
      transaction_detail_count: 0,
      transaction_detail_total:,
      previously_budgeted:,
      currently_budgeted:,
      budgeted:,
      difference: budgeted - transaction_detail_total,
      **attributes,
    )
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength
end
