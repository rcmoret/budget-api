# frozen_string_literal: true

module WebApp
  module Accounts
    class IndexController < BaseController
      include Mixins::PageController

      define_route_segment :accounts
      serialize_with WebApp::Accounts::IndexSerializer
      use_template "accounts/manage"
      subject(:accounts) do
        Account
          .belonging_to(current_user_profile)
          .by_priority
          .with_balance
      end
    end
  end
end
