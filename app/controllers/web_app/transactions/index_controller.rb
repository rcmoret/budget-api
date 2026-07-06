# frozen_string_literal: true

module WebApp
  module Transactions
    class IndexController < BaseController
      include Mixins::HasBudgetInterval
      include Mixins::HasAccount

      before_action -> { presenter.flash = flash }
      before_action :store_selected_account_path

      def call
        render inertia: "transactions/index", props: serializer.to_h
      end

      private

      def presenter
        @presenter ||=
          ::Presenters::Transactions::IndexPresenter.new(
            current_user_profile,
            account,
            interval,
            metadata
          )
      end

      def serializer
        IndexSerializer.new(
          presenter,
          params: {
            featured_account: account,
            current_user_profile:,
            month: interval.month,
            year: interval.year,
          }
        )
      end

      def metadata
        @metadata ||= Presenters::ControllerMetadata.new(
          namespace: "accounts",
          page_name: "transactions_index",
          prev_selected_account_path:
        )
      end

      def selected_account_serializer
        IndexSerializer.new(
          account:,
          interval:
        )
      end

      def namespace
        "accounts"
      end
    end
  end
end
