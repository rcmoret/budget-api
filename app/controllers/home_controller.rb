class HomeController < ActionController::Base
  layout "application"
  before_action :authenticate_user_profile!

  def index
    render inertia: "home/index", props: props
  end
  
  private

  def props
    {
      metadata: {
        namespace: "home",
      },
    }
  end
end
