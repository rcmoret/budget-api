# frozen_string_literal: true

module WebApp
  module Accounts
    class ShowSerializer < ApplicationSerializer
      def initialize(args)
        super(args[:account])
        @balance = args.fetch(:balance) { account.balance }
      end

      attributes :key, :name, :slug, :priority, :balance
      attribute :is_cash_flow, alias_of: :cash_flow?
      attribute :is_archived, alias_of: :deleted?
      attribute :archived_at,
        on_render: proc { |timestamp|
          render_date_time(timestamp, "%B %-d, %Y")
        }
      attribute :created_at,
        on_render: proc { |timestamp|
          render_date_time(timestamp, "%B %-d, %Y")
        }
    end
  end
end
