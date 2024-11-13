# frozen_string_literal: true

module User
  class ConfigurationView < ApplicationRecord
    self.table_name = :user_configuration_view

    scope :unset, -> { where(user_profile_id: nil) }
    scope :belonging_to, ->(user_profile) { where(user_profile_id: user_profile.id) }

    def self.value_for(user, description)
      belonging_to(user).or(unset).find_by(description: description).value
    end
  end
end
