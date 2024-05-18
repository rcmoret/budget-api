module User
  class Profile < ApplicationRecord
    include HasKeyIdentifier
    devise :database_authenticatable, :registerable, :recoverable, :rememberable

    belongs_to :user_group, class_name: "Group"
    has_many :accounts, through: :user_group
    alias_attribute :group, :user_group
  end
end
