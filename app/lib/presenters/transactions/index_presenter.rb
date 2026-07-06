# frozen_string_literal: true

module Presenters
  module Transactions
    class IndexPresenter
      include Presenters::WebApp::FlashMessagesConcern
      include Mixins::ActiveUserAccounts

      def initialize(user_profile, featured_account, budget_month, metadata)
        @featured_account = featured_account
        @user_profile = user_profile
        @budget_month = Budget::BudgetMonthPresenter.new(budget_month)
        @metadata = metadata
        @accounts = accounts_for(user_profile)
      end

      def transactions
        running_balance = balance_prior_to

        transactions_scope.map do |entry|
          entry_presenter = EntryPresenter.new(entry, running_balance)
          running_balance = entry_presenter.running_balance
          entry_presenter
        end
      end

      def balance_prior_to
        @balance_prior_to ||=
          featured_account.balance_prior_to(
            first_date,
            include_pending: future?
          )
      end

      def budget_items
        @budget_items ||= budget_month
                          .detailed_items
                          .available
                          .order(name: :asc)
      end

      delegate :current?,
        :date_range,
        :first_date,
        :future?,
        to: :budget_month

      attr_reader :accounts,
        :budget_month,
        :featured_account,
        :metadata,
        :user_profile

      delegate :key,
        :name,
        :slug,
        to: :featured_account,
        prefix: true

      private

      def transactions_scope
        @transactions_scope ||=
          featured_account
          .transactions
          .includes(
            :credit_transfer,
            :debit_transfer,
            receipt_attachment: :blob,
            details: { budget_item: { category: :icon } },
          )
          .between(date_range, include_pending: current?)
      end
    end
  end
end
