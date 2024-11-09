# frozen_string_literal: true

module WebApp
  module Accounts
    class CreateController < BaseController
      include Mixins::HasRedirectParams

      def call
        if account.save
          redirect_to redirect_path
        else
          binding.pry
          redirect_to accounts_manage_path
        end
      end

      private

      def account
        @account ||=
          Account.belonging_to(current_user_profile).build(create_params)
      end

      def create_params
        params
          .require(:account)
          .permit(
            :key,
            :name,
            :priority,
            :slug,
            :cash_flow
          )
      end
    end
  end
end
