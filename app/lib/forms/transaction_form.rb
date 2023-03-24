module Forms
  class TransactionForm
    include ActiveModel::Model

    validate :account_belongs_to_user!
    validate :unique_detail_keys!
    validate :eligible_for_exclusion!, if: :budget_exclusion?

    def initialize(user, transaction_entry, params)
      @user = user
      @params = params
      @transaction_entry = transaction_entry
    end

    def save
      transaction_entry.assign_attributes(params)

      return false unless valid?

      Transaction::Entry.transaction do
        transaction_entry.tap(&:save).reload

        raise ActiveRecord::Rollback unless valid?
      end

      errors.none?
    end

    private

    def valid?
      return true if super && transaction_entry.valid?

      promote_errors
      false
    end

    def account_belongs_to_user!
      return if Account.belonging_to(user).exists?(account_id)

      errors.add(:account, "not found")
    end

    def unique_detail_keys!
      return if details_attributes.size == detail_keys.uniq.size

      errors.add(:details, "keys must be unique")
    end

    def detail_keys
      details_attributes.map do |detail_attributes|
        detail_attributes[:key]
      end
    end

    def details_attributes
      @details_attributes ||= params.fetch(:details_attributes) { [] }
    end

    def promote_errors
      transaction_entry.errors.each do |error|
        errors.add(error.attribute, error.message)
      end
    end

    def eligible_for_exclusion!
      if account.cash_flow?
        errors.add(:budget_exclusion,
                   "Budget Exclusions only applicable for non-cash-flow accounts")
      end

      return if details.all? { |detail| detail.budget_item.nil? }

      errors.add(:budget_exclusion,
                 "Budget Exclusions cannot be associated with a budget item")
    end

    delegate :account, :account_id, :budget_exclusion?, :details, to: :transaction_entry

    attr_reader :user, :params, :transaction_entry
  end
end
