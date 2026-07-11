# frozen_string_literal: true

module WebApp
  class BaseController < ActionController::Base
    before_action :authenticate_user_profile!
    before_action :set_current_user!
    layout "application"

    private

    def prev_selected_account_path
      session[:selected_account_path].to_s
    end

    def set_current_user!
      Current.user_profile = current_user_profile
    end
  end
end
