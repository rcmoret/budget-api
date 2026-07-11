# frozen_string_literal: true

module WebApp
  module Transactions
    class IndexController < BaseController
      include Mixins::HasBudgetInterval
      include Mixins::HasAccount
      include Mixins::PageController

      before_action :store_selected_account_path

      define_route_segments :account, :transactions
      serialize_with Serializers::IndexSerializer
      use_template "transactions"

      subject do
        Presenters::IndexPresenter.new(
          account,
          interval,
        )
      end

      private

      def serializer_context
        { featured_account_slug: account.slug, month:, year: }
      end

      def route_segments
        super(account.slug, month, year)
      end

      def store_selected_account_path
        session[:selected_account_path] =
          transactions_path(account, month, year)
      end
    end
  end
end
