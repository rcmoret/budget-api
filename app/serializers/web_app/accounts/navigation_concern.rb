# frozen_string_literal: true

module WebApp
  module Accounts
    module NavigationConcern
      extend ActiveSupport::Concern

      included do
        attributes :accounts do
          attributes :name,
            :balance,
            :slug

          attribute :href do |account|
            Rails
              .application
              .routes
              .url_helpers
              .transactions_index_path(
                account,
                month: params[:month],
                year: params[:year],
              )
          end
        end

        def accounts(*)
          Account
            .belonging_to(params[:current_user_profile])
            .active
            .by_priority
            .with_balance
        end

        transform_keys :lower_camel
      end
    end
  end
end
