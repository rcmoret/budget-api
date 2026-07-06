module Presenters
  module Mixins
    module ActiveUserAccounts
      extend ActiveSupport::Concern

      def accounts_for(user_profile)
        @accounts_for ||=
          Account
          .belonging_to(user_profile)
          .active
          .by_priority
          .with_balance
      end
    end
  end
end
