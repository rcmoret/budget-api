# frozen_string_literal: true

module WebApp
  module Accounts
    module NavigationConcern
      extend ActiveSupport::Concern

      included do
        include Alba::Resource

        attributes :account_links

        def account_links(*)
          accounts.map do |account|
            WebApp::Accounts::AccountLinkSerializer.new(account)
          end
        end

        def accounts
          user_accounts
            .active
            .by_priority
            .with_balance
        end

        def user_accounts
          if Current.user_profile.present?
            Account.belonging_to(Current.user_profile)
          else
            Account.none
          end
        end
      end
    end

    class AccountLinkSerializer
      include Alba::Resource

      attributes :name, :balance, :slug
      attribute :href do |account|
        Rails
          .application
          .routes
          .url_helpers
          .transactions_path(
            account,
            month: params[:month],
            year: params[:year],
          )
      end
    end
  end
end
