# frozen_string_literal: true

module Presenters
  module Transactions
    class EntryPresenter < SimpleDelegator
      def initialize(entry, previous_balance)
        @previous_balance = previous_balance
        super(entry)
      end

      def running_balance
        previous_balance + amount
      end

      def amount = total

      attr_reader :previous_balance

      def receipt_url
        Rails.application.routes.url_helpers.rails_blob_path(
          receipt,
          only_path: true
        )
      end

      def receipt_filename
        receipt.filename.to_s
      end

      def transactor
        return description if description.present?

        if itemized?
          type_symbol
        else
          details.first.item.name
        end
      end

      delegate :content_type, to: :receipt, prefix: true

      delegate :attached?, to: :receipt, prefix: true

      private

      def itemized?
        details.size > 1
      end

      def type_inquiry
        ActiveSupport::StringInquirer.new(type_symbol.to_s)
      end

      def type_symbol
        case amount
        when 0
          :exchange
        when -Float::INFINITY..0
          :expense
        when 0..Float::INFINITY
          :revenue
        end
      end
    end
  end
end
