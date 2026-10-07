# frozen_string_literal: true

module WebApp
  module Budget
    module Items
      # The dashboard item, plus the transaction details applied to it.
      # Details are ordered like the transactions index (pending first, then
      # most recently cleared).
      class ItemSerializer < Dashboard::ItemSerializer
        attributes :is_per_diem_enabled

        many :transaction_details,
          source: proc { transaction_details.sort_by(&:entry) },
          resource: Items::TransactionDetailSerializer
      end
    end
  end
end
