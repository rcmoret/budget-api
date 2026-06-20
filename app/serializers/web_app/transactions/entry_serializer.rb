module WebApp
  module Transactions
    class EntrySerializer
      include Alba::Resource
      FORMAT = "%B %-d, %Y".freeze

      attributes :key,
        :account_key,
        :account_slug,
        :check_number,
        :description,
        :notes
      one :amount, resource: MonetaryAmountSerializer
      attribute(:is_budget_exclusion, &:budget_exclusion?)
      one :running_balance, resource: MonetaryAmountSerializer
      many :details, resource: DetailSerializer
      attribute :clearance_date do |entry|
        if entry.clearance_date.blank?
          :pending
        else
          entry.clearance_date.strftime(FORMAT)
        end
      end
      attribute :updated_at do |entry|
        entry.updated_at.strftime(FORMAT)
      end

      attributes :transfer_key, if: proc { |entry| entry.transfer? }

      attributes :receipt_url,
        :receipt_attached,
        :receipt_filename,
        if: proc { |entry| entry.receipt_attached? }

      transform_keys :lower_camel

      def account_key(transaction)
        transaction.account.key
      end

      def account_slug(transaction)
        transaction.account.slug
      end
    end
  end
end
