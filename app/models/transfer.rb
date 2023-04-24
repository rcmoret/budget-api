class Transfer < ApplicationRecord
  include HasKeyIdentifier
  include Fetchable

  belongs_to :from_transaction, class_name: "Transaction::Entry"
  belongs_to :to_transaction, class_name: "Transaction::Entry"
  accepts_nested_attributes_for :from_transaction
  accepts_nested_attributes_for :to_transaction

  after_destroy :destroy_transactions!

  scope :recent_first, -> { order(created_at: :desc) }
  scope :belonging_to, lambda { |user_or_group|
    joins(:to_transaction)
      .merge(Transaction::Entry.belonging_to(user_or_group))
      .joins(:from_transaction)
      .merge(Transaction::Entry.belonging_to(user_or_group))
  }

  def transaction_keys
    transactions.map(&:key)
  end

  def transaction_accounts
    transactions.map(&:account)
  end

  private

  def destroy_transactions!
    transactions.each(&:destroy)
  end

  def transactions
    [to_transaction, from_transaction]
  end
end
