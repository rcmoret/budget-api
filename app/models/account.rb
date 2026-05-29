class Account < ApplicationRecord
  include BelongsToUserGroup
  include Fetchable
  include HasKeyIdentifier
  include Slugable

  has_many :transactions,
    class_name: "Transaction::Entry",
    dependent: :restrict_with_exception
  has_many :details,
    class_name: "Transaction::Detail",
    through: :transactions
  scope :active, -> { where(archived_at: nil) }
  scope :by_priority, lambda {
    order(Arel.sql("priority ASC NULLS LAST, archived_at DESC"))
  }
  scope :cash_flow, -> { where(cash_flow: true) }
  scope :non_cash_flow, -> { where(cash_flow: false) }
  scope :details_prior_to, lambda { |date, include_pending:|
    joins(:details)
      .merge(
        Transaction::Detail.prior_to(date, include_pending:)
      )
  }
  scope :with_balance, lambda {
    left_joins(:details)
      .group("#{table_name}.id")
      .select(
        "#{table_name}.*",
        "COALESCE(SUM(transaction_details.amount), 0) AS balance"
      )
  }
  validates :name,
    :slug,
    if: :active?,
    uniqueness: { scope: :user_group_id }

  validates :slug,
    if: :active?,
    uniqueness: { scope: %i[user_group_id cash_flow] }

  validates :name, :slug, presence: true
  validates :priority, presence: true, if: :active?

  before_validation :nullify_priority!, if: :deleted?
  before_validation :set_priority!, if: :active?

  alias_attribute :is_cash_flow, :cash_flow

  def balance_prior_to(date, include_pending:)
    self
      .class
      .where(id:)
      .details_prior_to(date, include_pending:)
      .sum(:amount)
  end

  def deleted?
    archived_at.present?
  end

  def archived? = deleted?

  def destroy
    transactions.any? ? archive! : delete
  end

  def to_s = name

  def balance
    read_attribute(:balance) || details.total
  end

  def to_param = slug

  private

  def active? = archived_at.nil?

  def archive!
    update(archived_at: Time.current)
  end

  def set_priority!
    return if priority.present?

    self.priority = (self.class.belonging_to(user_group).maximum(:priority).to_i + 1)
  end

  def nullify_priority!
    self.priority = nil
  end
end
