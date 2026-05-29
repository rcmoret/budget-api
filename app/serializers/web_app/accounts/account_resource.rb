# frozen_string_literal: true

module WebApp
  module Accounts
    class AccountResource
      include Alba::Resource

      attributes :key,
        :archived_at,
        :balance,
        :created_at,
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

      def archived_at(account)
        return if account.archived_at.nil?

        account
          .archived_at
          .in_time_zone(params[:timezone])
          .strftime("%B %-d, %Y %Z")
      end

      transform_keys :lower_camel
    end
  end
end
