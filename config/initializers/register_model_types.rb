Rails.application.config.to_prepare do
  ActiveModel::Type.register(:budget_category, Types::BudgetCategory)
  ActiveModel::Type.register(:monetary_amount, Types::MonetaryAmount)
end
