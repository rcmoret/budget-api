class HomeController < ActionController::Base
  layout "application"
  before_action :authenticate_user_profile!

  def index
    @props = props
    respond_to do |format|
      format.json { render json: @props.to_json }
      format.all { redirect_to home_path }
    end
  end

  private

  def props = {}
end
