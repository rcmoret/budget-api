# frozen_string_literal: true

module WebApp
  class BaseController < ActionController::Base
    before_action :authenticate_user_profile!
    layout "application"

    private

    def page_props
      props
        .deep_merge({ metadata: metadata })
        .deep_transform_keys { |key| key.to_s.camelize(:lower) }
    end

    def metadata
      {
        user_key: current_user.key,
        namespace: namespace,
      }
    end

    def current_user
      User::Profile.first
    end
  end
end
