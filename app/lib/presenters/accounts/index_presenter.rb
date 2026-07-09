# frozen_string_literal: true

module Presenters
  module Accounts
    class IndexPresenter
      def initialize(user_profile)
        @accounts =
          Account
          .belonging_to(user_profile)
          .by_priority
          .with_balance
      end

      attr_reader :accounts
    end
  end
end
