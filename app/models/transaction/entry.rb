module Transaction
  class Entry < ApplicationRecord
    include HasKeyIdentifier
    include Fetchable
    include BelongsToUserGroup::Through[:account]
    include Scopes::Accounts
    include Scopes::ClearanceDate

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

    validate :single_detail!, if: :budget_exclusion?
    validate :detail_present!
    validate :amount_static!, if: :transfer?, on: :update
    alias_attribute :is_budget_exclusion, :budget_exclusion

    before_save :nullify_blank_notes!

    has_one_attached :receipt

    # rubocop:disable Rails/I18nLocaleTexts
    validates :receipt,
      content_type: {
        in: %w[image/png image/jpeg application/pdf],
        message: "must be a PNG, JPG, or PDF file",
      },
      size: {
        less_than: 10.megabytes,
        message: "must be less than 10MB",
      },
      if: -> { receipt.attached? }
    # rubocop:enable Rails/I18nLocaleTexts

    scope :budget_inclusions, -> { where(budget_exclusion: false) }
    scope :non_transfer, lambda {
      where
        .not(id: Transfer.select(:to_transaction_id))
        .where
        .not(id: Transfer.select(:from_transaction_id))
    }

    delegate :name, to: :account, prefix: true

    def self.total
      joins(:details).sum(:amount)
    end

    def self.by_detail_key!(key)
      find(Detail.by_key!(key).transaction_entry_id)
    end

    def total
      details.sum(:amount)
    end

    def transfer
      credit_transfer || debit_transfer
    end

    def transfer?
      credit_transfer? || debit_transfer?
    end

    def credit_transfer?
      credit_transfer.present?
    end

    def debit_transfer?
      debit_transfer.present?
    end

    private

    def nullify_blank_notes!
      self.notes = nil if notes.present? && Tiptap.blank?(notes)
    end

    def single_detail!
      return if details.size == 1

      if details.none?
        record_no_details!
      else
        errors.add(
          :budget_exclusion,
          "Cannot have multiple details for budget exclusion"
        )
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

    def amount_static!
      return unless details.any?(&:amount_changed?)

      transfer_total =
        if debit_transfer?
          transfer.to_transaction.total
        else
          transfer.from_transaction.total
        end
      return if details.sum(:amount) == -transfer_total

      errors.add(:total, "Cannot be changed for a transfer")
    end
  end
end
