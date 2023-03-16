module Auth
  module Token
    class Context < ApplicationRecord
      include HasKeyIdentifier
      include Fetchable

      self.table_name = :auth_token_contexts

      scope :belonging_to, ->(user) { where(user: user) }
      scope :active, -> { where(manually_expired_at: nil, expires_at: Time.current..) }
      belongs_to :user, class_name: "User::Account"

      validates :expires_at, :ip_address, presence: true
      validates :ip_address, length: { maximum: 200 }
      validate :manually_expired_at_current_past!

      def expired?
        manually_expired_at.present? || expires_at < Time.current
      end

      private

      def manually_expired_at_current_past!
        return if manually_expired_at.nil?
        return if manually_expired_at <= Time.current

        errors.add(:manually_expired_at, "cannot be set to a future time")
      end
    end
  end
end
