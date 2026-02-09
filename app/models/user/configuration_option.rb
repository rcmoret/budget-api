# frozen_string_literal: true

module User
  class ConfigurationOption < ApplicationRecord
    validates :description, uniqueness: true, presence: true
    validates :default_value, presence: true
    validates :default_value,
      inclusion: { in: ActiveSupport::TimeZone::MAPPING.values },
      if: :timezone_config?

    def timezone_config? = description == "timezone"
  end
end
