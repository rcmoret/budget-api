# frozen_string_literal: true

module WebApp
  module UserProfiles
    module Serializers
      class UserProfileSerializer < SubjectSerializer
        attributes :key, :email

        attribute(:timezone) { |profile| profile.configuration(:timezone) }

        # Native <select> options for the timezone picker. Values are the
        # tzinfo identifiers accepted by User::Configuration's validation.
        attribute(:timezone_options) do
          ActiveSupport::TimeZone.all.map do |zone|
            { label: zone.to_s, value: zone.tzinfo.name }
          end
        end
      end
    end
  end
end
