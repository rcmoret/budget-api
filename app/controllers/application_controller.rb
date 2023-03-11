class ApplicationController < ActionController::API
  def api_user
    @api_user ||= User.last
  end
end
