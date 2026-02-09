module WebApp
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
      attribute :updated_at, on_render: proc { |timestamp|
        render_date_time(timestamp, "%FT%TZ")
      }
      attribute :clearance_date, on_render: proc { |timestamp|
        render_date_time(timestamp)
      }
      attribute :receipt_url, conditional: :receipt_attached?
      attribute :receipt_filename, conditional: :receipt_attached?
      attribute :receipt_content_type, conditional: :receipt_attached?

      delegate :slug, :key, to: :account, prefix: true
      delegate :key, to: :transfer, prefix: true

      def amount
        details.pluck(:amount).sum
      end

      def receipt_url
        Rails.application.routes.url_helpers.rails_blob_path(
          receipt,
          only_path: true
        )
      end

      def receipt_filename
        receipt.filename.to_s
      end

      delegate :content_type, to: :receipt, prefix: true

      delegate :attached?, to: :receipt, prefix: true
    end
  end
end
