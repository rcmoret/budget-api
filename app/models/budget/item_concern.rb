# frozen_string_literal: true

module Budget
  module ItemConcern
    extend ActiveSupport::Concern

    included do
      include HasKeyIdentifier
      include Fetchable
      include BelongsToUserGroup::Through[
        association: :category,
        class_name: "Budget::Category"
      ]

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

      alias_attribute :category_id, :budget_category_id
      scope :prior_to,
        ->(date_hash) { joins(:interval).merge(Interval.prior_to(date_hash)) }
      scope :active, -> { where(deleted_at: nil) }
      scope :deleted, -> { where.not(deleted_at: nil) }
      scope :revenues, -> { joins(:category).merge(Category.revenues) }
      scope :expenses, -> { joins(:category).merge(Category.expenses) }
      scope :monthly, -> { joins(:category).merge(Category.monthly) }
      scope :weekly, -> { joins(:category).merge(Category.weekly) }
      scope :accruals, -> { joins(:category).merge(Category.accruals) }
      scope :non_accruals, -> { joins(:category).merge(Category.non_accruals) }

      delegate :accrual,
        :accrual?,
        :expense?,
        :icon_class_name,
        :monthly?,
        :name,
        :per_diem_enabled,
        :revenue?,
        :weekly?,
        to: :category
    end
  end
end
