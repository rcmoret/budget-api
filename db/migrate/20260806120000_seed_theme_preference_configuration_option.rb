# frozen_string_literal: true

class SeedThemePreferenceConfigurationOption < ActiveRecord::Migration[7.0]
  def up
    User::ConfigurationOption.find_or_create_by!(description: "theme_preference") do |option|
      option.default_value = "system"
    end
  end

  def down
    User::ConfigurationOption.find_by(description: "theme_preference")&.destroy
  end
end
