# frozen_string_literal: true

module Presenters
  module Accounts
    class IndexPresenter
      include Presenters::WebApp::FlashMessagesConcern

      def initialize(user_profile, metadata)
        @accounts =
          Account
          .belonging_to(user_profile)
          .by_priority.with_balance
        @metadata = metadata
      end

      attr_reader :accounts, :metadata
    end
  end
end
