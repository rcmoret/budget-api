# frozen_string_literal: true

module User
  class ConfigurationView < ApplicationRecord
    self.table_name = :user_configuration_view

    scope :belonging_to, lambda { |user_profile|
      where(user_profile_id: user_profile.id)
    }

    def self.value_for(user, description)
      belonging_to(user).find_by(description:).value
    end
  end
end
