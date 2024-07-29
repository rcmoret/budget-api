module User
  class Profile < ApplicationRecord
    include HasKeyIdentifier
    devise :database_authenticatable, :registerable, :recoverable, :rememberable

    belongs_to :user_group, class_name: "Group"
    has_many :accounts, through: :user_group
    alias_attribute :group, :user_group

    def configuration(option_description)
      ConfigurationView.value_for(self, option_description)
    end
  end
end
