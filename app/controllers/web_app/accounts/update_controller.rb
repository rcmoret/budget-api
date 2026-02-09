# frozen_string_literal: true

module WebApp
  module Accounts
    class UpdateController < BaseController
      include Mixins::HasRedirectParams
      before_action -> { redirect_to accounts_manage_path },
        if: -> { account.nil? }

      def call
        if account.update(update_params)
          redirect_to redirect_path
        else
          redirect_to accounts_manage_path
        end
      end

      private

      def account
        @account ||=
          Account.fetch(current_user_profile, key: params.fetch(:key))
      end

      def update_params
        params
          .require(:account)
          .permit(
            :name,
            :priority,
            :slug,
            :cash_flow,
            :archived_at
          )
      end
    end
  end
end
