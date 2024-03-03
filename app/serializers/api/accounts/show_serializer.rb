module API
  module Accounts
    class ShowSerializer < ApplicationSerializer
      def initialize(args)
        super(args[:account])
        @balance = args.fetch(:balance) { account.balance }
      end

      attributes :key, :name, :slug, :priority
      attribute :is_cash_flow, alias_of: :cash_flow?
      attribute :is_archived, alias_of: :deleted?
      attribute :archived_at, on_render: proc { |timestamp| timestamp&.strftime("%F") }
      attribute :balance

      attr_reader :balance

      private

      def account
        __getobj__
      end
    end
  end
end
