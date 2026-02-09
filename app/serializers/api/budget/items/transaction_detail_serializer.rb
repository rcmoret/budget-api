# frozeon_string_literal: true

module API
  module Budget
    module Items
      class TransactionDetailSerializer < ApplicationSerializer
        attributes :key, :account_name, :amount, :description
        attribute :clearance_date, on_render: proc { |date| render_date_time(date) }
        attribute :comparison_date, on_render: proc { |timestamp|
          render_date_time(timestamp, "%FT%TZ")
        }

        delegate :account_name, :clearance_date, :description, to: :entry

        def comparison_date
          clearance_date.presence || created_at
        end
      end
    end
  end
end
