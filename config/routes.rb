Rails.application.routes.draw do
  namespace :api do
    get "/accounts", to: "accounts_index#call"
  end
end
