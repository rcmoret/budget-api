module User
  class AccountSerializer < ApplicationSerializer
    def initialize(args)
      super(args[:account])
      @balance = args.fetch(:balance) { account.balance }
    end

    attributes :key, :name, :slug, :priority
    attribute :is_cash_flow, alias_of: :cash_flow?
    attribute :is_archived, alias_of: :archived?
    attribute :archived_at, on_render: proc { |datetime| datetime&.strftime("%F") }
    attribute :balance

    def transactions
      lambda { |interval|
        SerializableCollection.new(serializer: TransactionEntrySerializer) do
          account_transactions.between(interval.date_range, include_pending: interval.current?)
        end
      }
    end

    def balance_prior_to
      lambda { |interval|
        account.balance_prior_to(interval.first_date, include_pending: interval.future?)
      }
    end

    def archived?
      archived_at.present?
    end

    attr_reader :balance

    private

    def account
      __getobj__
    end

    def account_transactions
      account
        .transactions
        .includes(
          :credit_transfer,
          :debit_transfer,
          receipt_attachment: :blob,
          details: { budget_item: { category: :icon } },
        )
    end

    attr_reader :interval
  end
end
