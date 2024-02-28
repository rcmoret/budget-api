module Budget
  module Intervals
    class TransactionDetailSerializer < ApplicationSerializer
      attributes :key, :account_name, :amount, :description, :transaction_entry_key
      attribute :clearance_date, on_render: proc { |datetime| datetime&.strftime("%F") }
      attribute :updated_at, on_render: proc { |datetime| datetime.strftime("%FT%TZ") }

      delegate :account_name, :clearance_date, :description, to: :entry

      def transaction_entry_key
        entry.key
      end
    end
  end
end
