# frozen_string_literal: true

module WebApp
  module Mixins
    module HasAccount
      extend ActiveSupport::Concern

      included do
        before_action -> { redirect_to(accounts_path) },
          if: -> { account.nil? }
      end

      private

      def account
        @account ||= Account.fetch(current_user_profile, slug: params[:slug])
      end
    end
  end
end
