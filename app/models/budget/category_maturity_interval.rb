# frozen_string_literal: true

module Budget
  class CategoryMaturityInterval < ApplicationRecord
    belongs_to :interval, foreign_key: :budget_interval_id, inverse_of: :maturity_intervals
    belongs_to :category, foreign_key: :budget_category_id, inverse_of: :maturity_intervals

    validates :category, uniqueness: { scope: :interval }
    validate :category_accrual?

    scope :ordered, -> { joins(:interval).merge(Interval.ordered) }
    scope :on_or_after, ->(month:, year:) { joins(:interval).merge(Interval.on_or_after(month: month, year: year)) }
    scope :belonging_to, ->(user_or_group) { joins(:category).merge(Category.belonging_to(user_or_group)) }

    delegate :month, :year, to: :interval

    accepts_nested_attributes_for :interval, reject_if: proc { true }

    private

    def category_accrual?
      return false if category.accrual?

      errors.add(:budget_category, "must be an accrual")
    end
  end
end
