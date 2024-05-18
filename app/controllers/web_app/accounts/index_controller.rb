# frozen_string_literal: true

module WebApp
  module Accounts
    class IndexController < BaseController
      def call
        render inertia: "accounts/home", props: page_props
      end

      private

      def props
        API::Accounts::IndexSerializer.new(
          Account.belonging_to(current_user)
        ).render
      end

      def namespace
        "accounts"
      end
    end
  end
end
