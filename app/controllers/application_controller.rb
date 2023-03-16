class ApplicationController < ActionController::API
  private

  def api_user
    @api_user ||= User.last
  end
end
