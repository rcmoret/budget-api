# frozen_string_literal: true

module WebApp
  module Accounts
    class ShowSerializer < ApplicationSerializer
      attributes :key, :name, :slug, :priority
      attribute :is_cash_flow, alias_of: :cash_flow?
      attribute :is_archived, alias_of: :deleted?
      attribute :archived_at, on_render: proc { |timestamp| timestamp&.strftime("%B %-d, %Y") }
      attribute :created_at, on_render: proc { |timestamp| timestamp.strftime("%B %-d, %Y") }
    end
  end
end
