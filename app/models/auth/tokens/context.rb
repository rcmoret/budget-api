module Auth
  module Tokens
    class Context < ApplicationRecord
      include HasKeyIdentifier

      self.table_name = :auth_token_contexts

      scope :belonging_to, ->(user) { where(user: user) }
      scope :active, -> { where(manually_expired_at: nil, expires_at: Time.current..) }
      belongs_to :user, class_name: "User::Account"

      validates :expires_at, :ip_address, presence: true
      validates :ip_address, length: { maximum: 200 }
      validates :manually_expired_at, comparison: { less_than_or_equal_to: Time.current }, allow_nil: true

      def self.fetch(user:, identifier:)
        belonging_to(user).for(identifier)
      end
    end
  end
end
