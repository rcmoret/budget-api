# frozen_string_literal: true

module WebApp
  module Accounts
    class LinkSerializer
      include Alba::Resource
      include Rails.application.routes.url_helpers

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
  end
end
