# frozen_string_literal: true

module User
  class ConfigurationOption < ApplicationRecord
    THEME_PREFERENCES = %w[system light dark].freeze

    validates :description, uniqueness: true, presence: true
    validates :default_value, presence: true
    validates :default_value,
      inclusion: { in: ActiveSupport::TimeZone::MAPPING.values },
      if: :timezone_config?
    validates :default_value,
      inclusion: { in: THEME_PREFERENCES },
      if: :theme_config?

    def timezone_config? = description == "timezone"
    def theme_config? = description == "theme_preference"
  end
end
