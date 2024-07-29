# frozen_string_literal: true

module User
  class Configuration < ApplicationRecord
    belongs_to :user_profile, class_name: :Profile
    belongs_to :option, class_name: :ConfigurationOption
    alias_attribute :option_id, :user_configuration_option_id

    validates :value,
              inclusion: { in: ActiveSupport::TimeZone::MAPPING.values },
              if: :timezone_config?
    validates :value, presence: true
    # this has a unique index on it. ACAB and it doesn't respect scope
    # or know how th find that index
    # rubocop:disable Rails/UniqueValidationWithoutIndex
    validates :user_configuration_option_id, uniqueness: { scope: :user_profile_id }
    # rubocop:enable Rails/UniqueValidationWithoutIndex

    delegate :timezone_config?, to: :option
  end
end
