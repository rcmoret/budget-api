# frozeon_string_literal: true

module API
  module Budget
    module Items
      class TransactionDetailSerializer < ApplicationSerializer
        attributes :key, :account_name, :amount, :description
        attribute :clearance_date, on_render: proc { |date| date&.strftime("%F") }

        delegate :account_name, :clearance_date, :description, to: :entry
      end
    end
  end
end
