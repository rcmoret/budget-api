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

    namespace :tokens do
      post "/", to: "create#call"
      delete "/", to: "delete#call"
    end
  end
end
