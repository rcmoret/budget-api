Rails.application.routes.draw do
  namespace :api do
    namespace :accounts do
      get "/", to: "index#call"
      post "/", to: "create#call"
    end

    post "/tokens", to: "token_create#call"
  end
end
