Rails.application.routes.draw do
  root "home#index"

  devise_for :user_profiles, class_name: "User::Profile"

  namespace :api do
    draw("api/accounts")
    draw("api/budget")
    draw("api/tokens")
  end

  scope "/", module: :web_app do
    get "/dashboard", to: "dashboard#call", as: :dashboard

    draw("web_app/accounts")
    draw("web_app/budget")
    # this is for json requests that do not return inertia responses
    draw("web_app/data")

    devise_scope :user_profile do
      get "/sign-out", to: Devise::SessionsController.action(:destroy)
    end

    scope "/portfolio", module: :portfolio do
      get "/items", to: WebApp::Portfolio::ItemsIndexController.action(:call)
      post "/item", to: WebApp::Portfolio::CreateItemController.action(:call)
      put "/item/:key", to: WebApp::Portfolio::UpdateItemController.action(:call)
      put "/about", to: WebApp::Portfolio::UpdateAboutMeController.action(:call)
    end
  end
end
