module API
  module V1
    module Accounts
      class ManageSerializer < IndexSerializer
        attributes :object_key, :priority

        attribute(:is_cash_flow, &:cash_flow)
        attribute(:is_archived, &:archived?)
        attribute(:archived_at) { |account| account.archived_at&.iso8601 }
        attribute(:created_at) { |account| account.created_at.iso8601 }
      end
    end
  end
end
