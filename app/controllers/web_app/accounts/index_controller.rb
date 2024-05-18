# frozen_string_literal: true

module WebApp
  module Accounts
    class IndexController < BaseController
      def call
        render inertia: "accounts/index", props: page_props
      end

      private

      def accounts_props
        API::Accounts::IndexSerializer.new(
          Account.belonging_to(current_user)
        ).render
      end

      def props
        accounts_props.merge(selected_account: nil)
      end

      def namespace
        "accounts"
      end
    end
  end
end
