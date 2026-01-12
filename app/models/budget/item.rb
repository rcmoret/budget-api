# frozen_string_literal: true

module Budget
  class Item < ApplicationRecord
    include BelongsToUserGroup::Through[association: :category, class_name: "Budget::Category"]
    include HasKeyIdentifier
    include Fetchable

    has_many :transaction_details,
             class_name: "Transaction::Detail",
             foreign_key: :budget_item_id,
             inverse_of: :budget_item,
             dependent: :restrict_with_exception
    has_many :events,
             class_name: "ItemEvent",
             foreign_key: :budget_item_id,
             inverse_of: :item,
             dependent: :restrict_with_exception

    belongs_to :category, foreign_key: :budget_category_id, inverse_of: :items
    belongs_to :interval,
               class_name: "Interval",
               foreign_key: :budget_interval_id,
               inverse_of: :items

    validates :budget_category_id, uniqueness: { scope: :budget_interval_id, if: -> { weekly? && active? } }
    alias_attribute :category_id, :budget_category_id
    scope :prior_to, ->(date_hash) { joins(:interval).merge(Interval.prior_to(date_hash)) }
    scope :in_range, ->(date_args) { joins(:interval).merge(Interval.in_range(date_args)) }
    scope :active, -> { where(deleted_at: nil) }
    scope :deleted, -> { where.not(deleted_at: nil) }
    scope :revenues, -> { joins(:category).merge(Category.revenues) }
    scope :expenses, -> { joins(:category).merge(Category.expenses) }
    scope :monthly, -> { joins(:category).merge(Category.monthly) }
    scope :weekly, -> { joins(:category).merge(Category.weekly) }
    scope :accruals, -> { joins(:category).merge(Category.accruals) }
    scope :non_accruals, -> { joins(:category).merge(Category.non_accruals) }

    delegate :accrual,
             :expense?,
             :icon_class_name,
             :monthly?,
             :name,
             :per_diem_enabled,
             :revenue?,
             :weekly?,
             to: :category

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
