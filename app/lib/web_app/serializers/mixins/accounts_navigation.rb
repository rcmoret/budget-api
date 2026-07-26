# frozen_string_literal: true

module WebApp
  module Serializers
    module Mixins
      module AccountsNavigation
        extend ActiveSupport::Concern

        AccountLinkStruct = Data.define(
          :key,
          :balance,
          :name,
          :params,
          :slug
        ) do
          include Rails.application.routes.url_helpers

          def href
            transactions_path(
              slug,
              month: params[:month],
              year: params[:year],
            )
          end
        end

        included do
          include Alba::Resource

          attributes :account_links

          def account_links(*)
            accounts.map do |account|
              AccountLinkSerializer.new(
                AccountLinkStruct.new(
                  key: account.key,
                  name: account.name,
                  balance: account.balance,
                  slug: account.slug,
                  params:
                )
              )
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

      # `key` serves more than the nav links: it's what the transaction form's
      # account select submits, since an `account_key` param resolves through
      # `Account.fetch(key:)`.
      AccountLinkSerializer = Class.new(GenericSerializer) do
        attributes :key, :name, :balance, :slug, :href
      end
    end
  end
end
