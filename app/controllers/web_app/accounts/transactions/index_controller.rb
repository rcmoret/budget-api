# frozen_string_literal: true

module WebApp
  module Accounts
    module Transactions
      class IndexController < BaseController
        def call
          render inertia: "accounts/index", props: page_props
        end

        private

        def page_props
          super.tap do |pp|
            puts pp["selectedAccount"]["transactions"].first&.keys
          end
        end

        def props
          accounts_serializer.render.merge(
            selected_account: selected_account_serializer.render
          )
        end

        def accounts_serializer
          API::Accounts::IndexSerializer.new(
            Account.belonging_to(current_user)
          )
        end

        def selected_account_serializer
          API::Accounts::Transactions::IndexSerializer.new(
            account: account,
            interval: interval
          )
        end

        def account
          Account.belonging_to(current_user).by_slug(params[:slug])
        end

        def interval
          @interval ||= if month.nil? || year.nil?
                          Budget::Interval.belonging_to(current_user).current
                        else
                          Budget::Interval.fetch(current_user, key: { month: month, year: year })
                        end
        end

        def month
          params[:month]
        end

        def year
          params[:year]
        end

        def namespace
          "accounts"
        end
      end
    end
  end
end
