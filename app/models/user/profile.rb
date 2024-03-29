module User
  class Profile < ApplicationRecord
    include HasKeyIdentifier

    self.table_name = :users

    has_secure_password

    belongs_to :user_group, class_name: "Group"

    has_many :accounts, through: :user_group

    alias_attribute :password_digest, :encrypted_password
    alias_attribute :group, :user_group
  end
end
