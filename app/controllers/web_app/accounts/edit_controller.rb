# frozen_string_literal: true

module WebApp
  module Accounts
    class EditController < BaseController
      include Mixins::HasAccount
      include Mixins::PageController

      define_route_segments :accounts, :edit
      serialize_with Serializers::AccountSerializer
      use_template "accounts/edit"

      subject(:account) { account }

      private

      def route_segments
        super(account.slug)
      end
    end
  end
end
