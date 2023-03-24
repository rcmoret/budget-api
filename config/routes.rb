Rails.application.routes.draw do
  root "home#index"
  namespace :api do
    namespace :accounts do
      get "/", to: "index#call"
      post "/", to: "create#call"
    end

    scope "/account/:account_key", module: :accounts, as: :account do
      put "/", to: "update#call"
      delete "/", to: "delete#call"

      scope "transactions/(:month)/(:year)", module: :transactions, as: :transactions do
        get "/", to: "index#call"
        post "/", to: "create#call"
      end

      namespace :transaction, module: :transactions, as: :transaction do
        put "/:key/(:month)/(:year)", to: "update#call"
        delete "/:key/(:month)/(:year)", to: "delete#call"
      end
    end

    namespace :tokens do
      post "/", to: "create#call"
      delete "/", to: "delete#call"
    end
  end
end
