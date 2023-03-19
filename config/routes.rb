Rails.application.routes.draw do
  namespace :api do
    namespace :accounts do
      get "/", to: "index#call"
      post "/", to: "create#call"
      put "/:key", to: "update#call"
      delete "/:key", to: "delete#call"

      scope "/:account_key/transactions/:month/:year", module: :transactions do
        get "/", to: "index#call"
        post "/", to: "create#call"
        put "/:key", to: "update#call"
        delete "/:key", to: "delete#call"
      end
    end

    post "/tokens", to: "token_create#call"
  end
end
