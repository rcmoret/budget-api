# frozen_string_literal: true

module WebApp
  module Transactions
    class IndexController < BaseController
      before_action :store_selected_account_path

      def call
        render inertia: "accounts/show", props: page_props
      end

      private

      def props
        accounts_serializer.render.merge(
          selected_account: selected_account_serializer.render
        )
      end

      def accounts_serializer
        API::Accounts::IndexSerializer.new(
          Account.belonging_to(current_user_profile)
        )
      end

      def selected_account_serializer
        API::Accounts::Transactions::IndexSerializer.new(
          account: account,
          interval: interval
        )
      end

      def account
        @account ||= Account.belonging_to(current_user_profile).by_slug(params[:slug])
      end

      def interval
        @interval ||= if month.nil? || year.nil?
                        ::Budget::Interval.belonging_to(current_user_profile).current
                      else
                        ::Budget::Interval.fetch(current_user_profile, key: { month: month, year: year })
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

      def store_selected_account_path
        session[:selected_account_path] = transactions_index_path(account, month, year)
      end
    end
  end
end
