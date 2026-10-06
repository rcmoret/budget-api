# frozen_string_literal: true

module WebApp
  module Budget
    module Dashboard
      class ItemSerializer < ::Serializers::GenericSerializer
        attributes :key,
          :budget_category_key,
          :budget_category_slug,
          :currently_budgeted_percentage,
          :icon_class_name,
          :maturity_month,
          :maturity_year,
          :month,
          :name,
          :object_key,
          :previously_budgeted_percentage,
          :year

        attributes amount: :money, currently_budgeted: :money
        attribute(:is_accrual, &:accrual?)
        attribute(:is_deleted, &:deleted?)
        attribute(:is_cleared, &:cleared?)
        attribute(:is_deletable, &:deletable?)
        attribute(:is_expense, &:expense?)
        attribute(:is_fixed, &:monthly?)
        attribute(:is_mature, &:mature?)
        attribute(:is_pending) { |item| !item.cleared? }
        attributes previously_budgeted: :money,
          remaining: :money,
          transaction_detail_total: :money
        attribute(:transaction_details) { [] }
        attribute(:upcoming_maturity_month) do |item|
          item.upcoming_maturity_date&.strftime("%b %Y")
        end
      end
    end
  end
end
