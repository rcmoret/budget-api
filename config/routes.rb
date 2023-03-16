Rails.application.routes.draw do
  namespace :api do
    get "/accounts", to: "accounts_index#call"
    post "/tokens", to: "token_create#call"
  end
end
