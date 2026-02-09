module API
  module Transactions
    class EntrySerializer < ApplicationSerializer
      attributes :key,
        :account_key,
        :account_slug,
        :amount,
        :check_number,
        :description,
        :notes
      attribute :transfer_key, conditional: :transfer?
      attribute :is_budget_exclusion, alias_of: :budget_exclusion?
      attribute :details, each_serializer: DetailSerializer
      attribute :updated_at, on_render: proc { |timestamp| render_date_time(timestamp, "%FT%TZ") }
      attribute :clearance_date, on_render: proc { |timestamp| render_date_time(timestamp) }
      attribute :short_clearance_date, on_render: proc { |timestamp|
        render_date_time(timestamp, "%-m/%-d")
      }

      delegate :slug, :key, to: :account, prefix: true
      delegate :key, to: :transfer, prefix: true

      def amount
        details.pluck(:amount).sum
      end
    end
  end
end
