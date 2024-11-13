# frozen_string_literal: true

module WebApp
  module Mixins
    module HasAccount
      extend ActiveSupport::Concern

      included do
        before_action :store_selected_account_path
        before_action -> { redirect_to(home_path) }, if: -> { account.nil? }
      end

      private

      def account
        @account ||= Account.belonging_to(current_user_profile).by_slug(params[:slug])
      end

      def store_selected_account_path
        session[:selected_account_path] = transactions_index_path(account, month, year)
      end
    end
  end
end
