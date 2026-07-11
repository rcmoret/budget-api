# frozen_string_literal: true

module WebApp
  module Accounts
    module Serializers
      class AccountSerializer < GenericSerializer
        include Rails.application.routes.url_helpers

        attributes :key,
          :archived_at,
          :balance,
          :created_at,
          :href,
          :name,
          :object_key,
          :priority,
          :slug

        attribute(:is_cash_flow, &:cash_flow)
        attribute(:is_archived) { |account| account.archived_at.present? }
        attribute(:created_at) do |account|
          account
            .created_at
            .in_time_zone(params[:timezone])
            .strftime("%B %-d, %Y %Z")
        end
        attribute(:edit_route) { |account| account_edit_path(account) }

        def archived_at(account)
          return if account.archived_at.nil?

          account
            .archived_at
            .in_time_zone(params[:timezone])
            .strftime("%B %-d, %Y %Z")
        end

        def href(account)
          if params[:month].present? && params[:year].present?
            transactions_path(
              account,
              month: params[:month],
              year: params[:year],
            )
          else
            transactions_path(account)
          end
        end
      end
    end
  end
end
