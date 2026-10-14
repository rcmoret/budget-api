Rails.application.routes.draw do
  root "home#index"

  devise_for :user_profiles, class_name: "User::Profile"

  if Rails.env.development?
    mount Rswag::Api::Engine => "/api-docs"
    mount Rswag::Ui::Engine => "/api-docs"
  end

  namespace :api do
    namespace :v1 do
      draw("api/v1/accounts")
      draw("api/v1/budget")
      draw("api/v1/tokens")
    end
  end

  scope "/", module: :web_app do
    get "/dashboard",
      to: WebApp::Budget::DashboardController.action(:call),
      as: :dashboard

    draw("web_app/accounts")
    draw("web_app/budget")

    # these routes return json data; no inertia responses
    draw("web_app/data")

    devise_scope :user_profile do
      get "/sign-out",
        to: Devise::SessionsController.action(:destroy),
        as: :user_sign_out
    end

    scope "/profile" do
      get "/",
        to: WebApp::UserProfiles::ShowController.action(:call),
        as: :manage_profile
      put "/",
        to: WebApp::UserProfiles::UpdateController.action(:call)
    end
  end
end
