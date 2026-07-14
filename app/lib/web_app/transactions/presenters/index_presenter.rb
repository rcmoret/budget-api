# frozen_string_literal: true

module WebApp
  module Transactions
    module Presenters
      class IndexPresenter
        include Rails.application.routes.url_helpers

        def initialize(featured_account, budget_month)
          @featured_account = featured_account
          @budget_month = Budget::Presenters::BudgetMonthPresenter
                          .new(budget_month)
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

        def edit_route
          account_edit_path(featured_account_slug)
        end

        delegate :current?,
          :date_range,
          :first_date,
          :future?,
          to: :budget_month

        attr_reader :budget_month,
          :featured_account

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
end
