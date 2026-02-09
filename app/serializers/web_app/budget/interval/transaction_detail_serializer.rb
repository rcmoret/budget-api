module WebApp
  module Budget
    module Interval
      class TransactionDetailSerializer < ApplicationSerializer
        attributes :key,
          :account_name,
          :amount,
          :description,
          :transaction_entry_key
        attribute :clearance_date,
          on_render: proc { |timestamp|
            render_date_time(timestamp)
          }
        attribute :updated_at,
          on_render: proc { |timestamp|
            render_date_time(timestamp, "%FT%TZ")
          }

        delegate :account_name, :clearance_date, :description, to: :entry

        def transaction_entry_key
          entry.key
        end
      end
    end
  end
end
