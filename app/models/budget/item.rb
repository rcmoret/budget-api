# frozen_string_literal: true

module Budget
  class Item < ApplicationRecord
    include ItemConcern

    validates :budget_category_id,
      uniqueness: {
        scope: :budget_interval_id,
        if: -> { weekly? && active? },
      }

    def delete
      raise NonDeleteableError if transaction_details.any?

      update(deleted_at: Time.current)
    end

    def deletable?
      transaction_details.none?
    end

    def deleted? = deleted_at.present?

    def amount
      events.sum(&:amount)
    end

    def previously_budgeted
      events.previously_budgeted.sum(&:amount)
    end

    def currently_budgeted
      events.currently_budgeted.sum(&:amount)
    end

    def spent
      transaction_details.sum(:amount)
    end

    def transaction_detail_count
      transaction_details.size
    end

    def difference
      amount - spent
    end

    def decorated
      decorator_class.new(self)
    end

    def budget_category_key=(category_key)
      self.budget_category_id =
        if category_key.blank?
          nil
        else
          Category.by_key(category_key)&.id
        end
    end

    NonDeleteableError = Class.new(StandardError)

    private

    def decorator_class
      if monthly?
        Presenters::Budget::MonthlyItemPresenter
      elsif expense?
        Presenters::Budget::DayToDayExpensePresenter
      else
        Presenters::Budget::DayToDayRevenuePresenter
      end
    end

    def active?
      deleted_at.nil?
    end
  end
end
