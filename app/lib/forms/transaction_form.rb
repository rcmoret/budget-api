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
        transaction_entry.save!

        raise ActiveRecord::Rollback unless valid?
      end

      transaction_entry.reload

      errors.none?
    end

    def errors
      return transaction_errors.to_hash if details_errors.empty?

      transaction_errors
        .to_hash
        .merge(detail_items: details_errors)
        .reject { |key, _val| key.to_s.starts_with?("details.") }
    end

    private

    def valid?
      return true if super && transaction_entry.valid? && details.all?(&:valid?)

      promote_errors
      false
    end

    def account_belongs_to_user!
      return if Account.belonging_to(user).exists?(account_id)

      transaction_errors.add(:account, "not found")
    end

    # rubocop:disable Metrics/AbcSize
    def unique_detail_keys!
      return if details_attributes.size == detail_keys.uniq.size

      details.each do |detail|
        next if detail_keys.one? { |key| key == detail.key }
        next if detail_model_errors[detail.key][:key].include?("must be unique")

        detail_model_errors[detail.key].add(:key, "must be unique")
      end
    end
    # rubocop:enable Metrics/AbcSize

    def promote_errors
      details.each do |detail|
        next if detail.valid?

        detail.errors.each do |error|
          detail_model_errors[detail.key].add(error.attribute, error.message)
        end
      end
    end

    def detail_keys
      details_attributes.pluck(:key)
    end

    def details_attributes
      @details_attributes ||= params.fetch(:details_attributes) { [] }
    end

    def eligible_for_exclusion!
      if account.cash_flow?
        transaction_errors.add(:budget_exclusion,
          "Budget Exclusions only applicable for non-cash-flow accounts")
      end

      return if details.all? { |detail| detail.budget_item.nil? }

      transaction_errors.add(:budget_exclusion,
        "Budget Exclusions cannot be associated with a budget item")
    end

    def details_errors
      detail_model_errors.filter_map do |key, err|
        err.to_hash.merge(identifier: key) if err.any?
      end
    end

    def transaction_errors
      transaction_entry.errors
    end

    def detail_model_errors
      @detail_model_errors ||= details.reduce({}) do |memo, detail|
        memo.merge(detail.key => ActiveModel::Errors.new(detail))
      end
    end

    delegate :account,
      :account_id,
      :budget_exclusion?,
      :details,
      to: :transaction_entry

    attr_reader :user, :params, :transaction_entry
  end
end
