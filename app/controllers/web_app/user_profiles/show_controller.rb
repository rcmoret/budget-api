# frozen_string_literal: true

module WebApp
  module UserProfiles
    class ShowController < BaseController
      include Mixins::PageController

      define_route_segment :user_profiles
      serialize_with Serializers::UserProfileSerializer
      use_template "user_profiles"

      subject(:user_profile) { current_user_profile }
    end
  end
end
