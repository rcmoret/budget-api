# frozen_string_literal: true

module WebApp
  module Transactions
    class IndexController < BaseController
      include Mixins::HasBudgetInterval
      include Mixins::HasAccount

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
        IndexSerializer.new(
          account: account,
          interval: interval
        )
      end

      def namespace
        "accounts"
      end
    end
  end
end
