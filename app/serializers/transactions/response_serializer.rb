module Transactions
  class ResponseSerializer < ApplicationSerializer
    attribute :accounts, on_render: :render
    attribute :transactions, on_render: :render
    attribute :budget_items, on_render: :render, conditional: proc { budget_items.any? }
    attribute :deleted_transaction_keys, conditional: proc { deleted_transaction_keys.any? }

    # rubocop:disable Lint/MissingSuper
    def initialize(accounts:, transactions:, interval:, deleted_transaction_keys: [], budget_items: [])
      @included_accounts = accounts
      @included_transactions = transactions
      @included_budget_items = budget_items
      @interval = interval
      @deleted_transaction_keys = deleted_transaction_keys
    end
    # rubocop:enable Lint/MissingSuper

    def accounts
      SerializableCollection.new(serializer: AccountBalanceSerializer, interval: interval) do
        included_accounts
      end
    end

    def transactions
      SerializableCollection.new(serializer: EntrySerializer) do
        included_transactions
      end
    end

    def budget_items
      SerializableCollection.new(serializer: BudgetItemSerializer) do
        included_budget_items
      end
    end

    BudgetItemSerializer = Class.new(ApplicationSerializer) do
      attributes :key, :remaining
      attribute :is_deletable, alias_of: :deletable?
      attribute :is_monthly, alias_of: :monthly?
    end

    private

    attr_reader :deleted_transaction_keys,
                :included_accounts,
                :included_transactions,
                :included_budget_items,
                :interval
  end
end
