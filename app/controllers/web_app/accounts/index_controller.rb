# frozen_string_literal: true

module WebApp
  module Accounts
    class IndexController < BaseController
      before_action -> { presenter.flash = flash }

      def call
        render inertia: "accounts/manage", props: serializer.to_h
      end

      private

      def serializer
        WebApp::Accounts::IndexSerializer
          .new(presenter)
      end

      def presenter
        @presenter ||=
          Presenters::Accounts::IndexPresenter
          .new(current_user_profile, metadata)
      end

      def accounts
        Account
          .belonging_to(current_user_profile)
          .with_balance
          .by_priority
      end

      def metadata
        @metadata ||= Presenters::ControllerMetadata.new(
          namespace: "accounts",
          prev_selected_account_path:
        )
      end

      def namespace
        "accounts"
      end
    end
  end
end
