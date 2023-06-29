module Accounts
  class TransactionsIndexSerializer < User::AccountSerializer
    attributes :key, :name, :slug, :priority, :balance, :balance_prior_to
    attribute :transactions, on_render: :render
    attribute :is_cash_flow, alias_of: :cash_flow?
    attribute :is_archived, alias_of: :archived?
    attribute :archived_at, on_render: proc { |datetime| datetime&.strftime("%F") }
    attribute :budget, serializer: BudgetSerializer, alias_of: :interval

    def initialize(account:, interval:)
      super(account: account)
      @interval = interval
    end

    def transactions
      super.call(interval)
    end

    def balance_prior_to
      super.call(interval)
    end

    attr_reader :interval
  end
end
