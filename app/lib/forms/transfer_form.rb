module Forms
  class TransferForm
    include ActiveModel::Model

    validates :to_account, :from_account, presence: true
    validate :separate_accounts
    validates :amount, numericality: { greater_than: 0 }

    def initialize(user:, params:)
      @user = user
      @to_account_key = params.fetch(:to_account_key)
      @from_account_key = params.fetch(:from_account_key)
      @amount = params.fetch(:amount).to_i.abs
      @key = params.fetch(:key) { generate_key_indentifier }
    end

    def call
      return [:error, errors.to_hash] if invalid?

      create!

      return [:error, errors.to_hash] if errors.any?

      [:ok, success_hash]
    end

    private

    def create!
      Transfer.transaction { transfer.save }
    end

    def transfer
      @transfer ||= Transfer.new(
        key: key,
        from_transaction_attributes: from_transaction_attributes,
        to_transaction_attributes: to_transaction_attributes,
      )
    end

    def from_transaction_attributes
      {
        description: "Transfer to #{to_account}",
        account: from_account,
        key: generate_key_indentifier,
        details_attributes: [{ key: generate_key_indentifier, amount: -amount }],
      }
    end

    def to_transaction_attributes
      {
        description: "Transfer from #{from_account}",
        account: to_account,
        key: generate_key_indentifier,
        details_attributes: [{ key: generate_key_indentifier, amount: amount }],
      }
    end

    attr_reader :user, :to_account_key, :from_account_key, :amount, :key

    def to_account
      @to_account ||= Account.fetch(user: user, key: to_account_key)
    end

    def from_account
      @from_account ||= Account.fetch(user: user, key: from_account_key)
    end

    def promote_errors(model_name, model_errors)
      model_errors.each do |attribute, message|
        errors.add("#{model_name}.#{attribute}", message)
      end
    end

    def separate_accounts
      return unless to_account&.id == from_account&.id

      errors.add(:from_account, "cannot be the same account as 'to' account")
    end

    def generate_key_indentifier
      SecureRandom.hex(6)
    end

    def success_hash
      {
        transfer: transfer,
        from_account: from_account,
        from_transaction: transfer.from_transaction,
        to_account: to_account,
        to_transaction: transfer.to_transaction,
      }
    end
  end
end
