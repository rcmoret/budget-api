module API
  module HasTransactionEntry
    extend ActiveSupport::Concern

    included do
      before_action :insure_transaction_found
    end

    private

    def transaction_entry
      @transaction_entry ||= account.transactions.fetch(api_user, key: key)
    end

    def key
      params.fetch(:key)
    end

    def insure_transaction_found
      return if transaction_entry.present?

      render json: { transaction: "not found by key: #{key}" }, status: :not_found
    end
  end
end
