Rails.application.routes.draw do
  root "home#index"

  devise_for :user_profiles, class_name: "User::Profile"

  namespace :api do
    draw("api/accounts")
    draw("api/budget")
    draw("api/tokens")
  end

  scope "/", module: :web_app do
    get "/home", to: "home#call", as: :home
    draw("web_app/accounts")
    draw("web_app/budget")
  end
end
