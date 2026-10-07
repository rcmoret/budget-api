# frozen_string_literal: true

module WebApp
  module Budget
    module Items
      # A transaction detail applied to a budget item, with enough of its
      # entry and account to display (and link back to) the transaction
      class TransactionDetailSerializer < ::Serializers::GenericSerializer
        FORMAT = "%B %-d, %Y"

        attributes :key
        attributes amount: :money
        attribute(:transaction_key) { |detail| detail.entry.key }
        attribute(:description) { |detail| detail.entry.description }
        attribute(:clearance_date) do |detail|
          detail.entry.clearance_date&.strftime(FORMAT)
        end
        attribute(:is_pending) { |detail| detail.entry.pending? }
        attribute(:account_name) { |detail| detail.entry.account.name }
        attribute(:account_slug) { |detail| detail.entry.account.slug }
      end
    end
  end
end
