module Budget
  class Category < ApplicationRecord
    include BelongsToUserGroup
    include Fetchable
    include HasKeyIdentifier
    include Messages
    include Slugable

    has_many :items, foreign_key: :budget_category_id, inverse_of: :category, dependent: :restrict_with_exception
    has_many :transaction_details, through: :items
    has_many :events, through: :items
    has_many :maturity_intervals,
             -> { ordered },
             class_name: "CategoryMaturityInterval",
             dependent: :destroy,
             inverse_of: :category,
             foreign_key: :budget_category_id
    belongs_to :icon, optional: true

    validates :default_amount, numericality: { only_integer: true }
    validates :default_amount,
              numericality: {
                less_than_or_equal_to: 0,
                message: EXPENSE_AMOUNT_VALIDATION_MESSAGE,
              },
              if: :expense?
    validates :default_amount,
              numericality: {
                greater_than_or_equal_to: 0,
                message: REVENUE_AMOUNT_VALIDATION_MESSAGE,
              },
              if: :revenue?

    validates :name, uniqueness: { scope: :user_group_id }
    validates :default_amount, :name, presence: true
    validate :accrual_on_expense
    validate :per_diem_disabled, if: :monthly?
    validate :expense_unchanged!
    validate :monthly_unchanged!

    scope :active, -> { where(archived_at: nil) }
    scope :accruals, -> { where(accrual: true) }
    scope :non_accruals, -> { where(accrual: false) }
    scope :monthly, -> { where(monthly: true) }
    scope :weekly, -> { where(monthly: false) }
    scope :expenses, -> { where(expense: true) }
    scope :revenues, -> { where(expense: false) }

    alias_attribute :is_accrual, :accrual
    alias_attribute :is_expense, :expense
    alias_attribute :is_monthly, :monthly
    alias_attribute :per_diem_enabled?, :is_per_diem_enabled
    delegate :class_name, :name, to: :icon, prefix: true, allow_nil: true

    def revenue?
      !expense?
    end

    def weekly?
      !monthly?
    end

    def archived?
      archived_at.present?
    end

    def archive!
      update(archived_at: Time.current)
    end

    def unarchive!
      update(archived_at: nil)
    end

    def destroy
      items.none? ? delete : archive!
    end

    private

    def accrual_on_expense
      return if expense? || (!accrual && revenue?)

      errors.add(:accrual, "can only be enabled for expenses")
    end

    def per_diem_disabled
      return unless per_diem_enabled?

      errors.add(:is_per_diem_enabled, "not available on monthly category")
    end

    def expense_unchanged!
      return if new_record? || !expense_changed?

      errors.add(:expense, "cannot be changed after creation")
    end

    def monthly_unchanged!
      return if new_record? || !monthly_changed?

      errors.add(:monthly, "cannot be changed after creation")
    end
  end
end
