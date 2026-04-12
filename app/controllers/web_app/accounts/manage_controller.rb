# frozen_string_literal: true

module WebApp
  module Accounts
    class ManageController < BaseController
      def call
        render inertia: "accounts/manage", props: page_props
      end

      private

      def props = { accounts: accounts.render }

      def accounts
        WebApp::Accounts::IndexSerializer.new(
          Account.belonging_to(current_user_profile)
        ).render
      end

      def namespace = "accounts"
    end
  end
end
