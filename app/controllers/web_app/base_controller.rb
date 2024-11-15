# frozen_string_literal: true

module WebApp
  class BaseController < ActionController::Base
    before_action :authenticate_user_profile!
    layout "application"

    private

    def page_props
      props
        .deep_merge({ metadata: metadata })
        .merge(errors.any? ? { errors: errors } : {})
        .deep_transform_keys { |key| key.to_s.camelize(:lower) }
    end

    def metadata
      {
        user_key: current_user_profile.key,
        namespace: namespace,
        prev_selected_account_path: session[:selected_account_path].to_s,
      }
    end

    def errors = {}
  end
end
