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
  scope :by_priority, -> { order("priority asc") }
  scope :cash_flow, -> { where(cash_flow: true) }
  scope :non_cash_flow, -> { where(cash_flow: false) }
  scope :details_prior_to, lambda { |date, include_pending:|
    joins(:details)
      .merge(
        Transaction::Detail.prior_to(date, include_pending:)
      )
  }
  validates :name, :priority, :slug, if: :active?,
    uniqueness: { scope: :user_group_id }
  validates :name, :priority, :slug, presence: true
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

  def destroy
    transactions.any? ? archive! : delete
  end

  def to_s = name

  def balance = details.total

  def to_param = slug

  private

  def active? = archived_at.nil?

  def archive!
    update(archived_at: Time.current)
  end
end
