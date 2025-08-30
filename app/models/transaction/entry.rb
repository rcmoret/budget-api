module Transaction
  class Entry < ApplicationRecord
    include HasKeyIdentifier
    include Fetchable

    belongs_to :account
    has_one :debit_transfer,
            class_name: "Transfer",
            foreign_key: :from_transaction_id,
            dependent: :restrict_with_error,
            inverse_of: :from_transaction
    has_one :credit_transfer,
            class_name: "Transfer",
            foreign_key: :to_transaction_id,
            dependent: :restrict_with_error,
            inverse_of: :to_transaction
    has_many :details,
             foreign_key: :transaction_entry_id,
             dependent: :destroy,
             inverse_of: :entry
    has_many :budget_items, through: :details
    accepts_nested_attributes_for :details, allow_destroy: true

    validate :single_detail!, if: -> { transfer? || budget_exclusion? }
    validate :eligible_for_transfer!, if: :transfer?
    validate :detail_present!
    alias_attribute :is_budget_exclusion, :budget_exclusion

    has_one_attached :receipt

    scope :belonging_to, ->(user_or_group) { joins(:account).merge(Account.belonging_to(user_or_group)) }

    scope :cleared, -> { where.not(clearance_date: nil) }
    scope :pending, -> { where(clearance_date: nil) }
    scope :prior_to, lambda { |date, include_pending: false|
      base_scope = cleared.where(arel_table[:clearance_date].lt(date))
      include_pending ? base_scope.or(pending) : base_scope
    }
    scope :prior_to_or_on, lambda { |date, include_pending: false|
      base_scope = cleared.where(arel_table[:clearance_date].lteq(date))
      include_pending ? base_scope.or(pending) : base_scope
    }
    scope :in, ->(range) { where(clearance_date: range) }
    scope :between, ->(range, include_pending: false) { include_pending ? self.in(range).or(pending) : self.in(range) }
    scope :budget_inclusions, -> { where(budget_exclusion: false) }
    scope :budget_exclusions, -> { where(budget_exclusion: true) }
    scope :cash_flow, -> { joins(:account).merge(Account.cash_flow) }
    scope :non_cash_flow, -> { joins(:account).merge(Account.non_cash_flow) }
    scope :non_transfer, -> { where.not(id: Transfer.transaction_ids) }

    delegate :name, to: :account, prefix: true

    def self.total
      joins(:details).sum(:amount)
    end

    def total
      details.sum(:amount)
    end

    def transfer
      credit_transfer || debit_transfer
    end

    def transfer?
      [credit_transfer, debit_transfer].any?
    end

    private

    def eligible_for_transfer!
      return if details.all? { |detail| detail.budget_item.nil? }

      errors.add(:transfer, "Transfer cannot be associated with a budget item")
    end

    def single_detail!
      return if details.size == 1

      if details.none?
        record_no_details!
      else
        record_multiple_details!
      end
    end

    def record_multiple_details!
      if transfer?
        errors.add(:transfer,
                   "Cannot have multiple details for transfer",)
      else # budget_exclusion
        errors.add(:budget_exclusion,
                   "Cannot have multiple details for budget exclusion",)
      end
    end

    def detail_present!
      return if details.any?

      record_no_details!
    end

    def record_no_details!
      if transfer? || budget_exclusion?
        errors.add(
          :details,
          "This type of transaction " \
          "(#{transfer? ? :transfer : :budget_exclusion}) " \
          "must have exactly 1 detail",
        )
      else # non-tranfer; budget included
        errors.add(:details, "Must have at least one detail for this entry")
      end
    end
  end
end
