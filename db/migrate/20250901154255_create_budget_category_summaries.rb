class CreateBudgetCategorySummaries < ActiveRecord::Migration[7.0]
  def change
    create_view :budget_category_summaries
  end
end
