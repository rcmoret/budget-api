module API
  module HasCategoryParams
    PERMITTED_PARAMS = %i[
      key
      archived_at
      default_amount
      accrual
      expense
      icon_id
      is_accrual
      is_expense
      is_monthly
      is_per_diem_enabled
      monthly
      name
      slug
    ].freeze

    private

    def budget_category_params
      params
        .require(:budget_category)
        .permit(*PERMITTED_PARAMS)
    end
  end
end
