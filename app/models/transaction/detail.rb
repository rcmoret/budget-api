module Transaction
  class Detail < ApplicationRecord
    include HasKeyIdentifier

    belongs_to :budget_item, class_name: "Budget::Item", optional: true
    belongs_to :entry,
               optional: false,
               inverse_of: :details,
               foreign_key: :transaction_entry_id
    has_one :account, through: :entry
    validates :amount, presence: true
    validates :budget_item_id, uniqueness: true, if: :budget_item_monthly?
    validate :amount_static!, if: :transfer?, on: :update

    scope :discretionary, -> { where(budget_item_id: nil) }
    scope :prior_to, lambda { |date, include_pending: false|
                       joins(:entry).merge(Entry.prior_to(date, include_pending: include_pending))
                     }
    scope :pending, -> { joins(:entry).merge(Entry.pending) }
    scope :budget_inclusions, -> { joins(:entry).merge(Entry.budget_inclusions) }
    scope :for_accounts, lambda { |account_ids|
      joins(:entry).where(transaction_entries: { account_id: account_ids })
    }
    scope :between, lambda { |date_range, include_pending:|
      joins(:entry).merge(Entry.between(date_range, include_pending: include_pending))
    }
    scope :cash_flow, -> { joins(:entry).merge(Entry.cash_flow) }
    scope :non_cash_flow, -> { joins(:entry).merge(Entry.non_cash_flow) }
    scope :belonging_to, ->(user_or_group) { joins(:entry).merge(Entry.belonging_to(user_or_group)) }

    delegate :monthly?, to: :budget_item, allow_nil: true, prefix: true
    delegate :transfer?, to: :entry

    def self.total
      sum(:amount)
    end

    private

    def amount_static!
      return unless amount_changed?

      errors.add(:amount, "Cannot be changed for a transfer")
    end
  end
end
