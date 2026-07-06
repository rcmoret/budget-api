module WebApp
  module Mixins
    module ActiveAccountsConcern
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
