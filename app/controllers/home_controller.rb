class HomeController < ActionController::Base
  layout "application"
  before_action :authenticate_user_profile!

  def index
    render inertia: "accounts/index", props: { accounts: [] }
  end
end
