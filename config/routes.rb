Rails.application.routes.draw do
  root "home#index"
  namespace :api do
    namespace :accounts do
      get "/", to: "index#call"
      post "/", to: "create#call"
      post "transfers/(:month)/(:year)", to: "transfers/create#call", as: :transfers
      delete "/transfer/:transfer_key/(:month)/(:year)", to: "transfers/delete#call", as: :transfer
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

    namespace :budget do
      namespace :categories do
        get "/", to: "index#call"
        post "/", to: "create#call"
      end

      scope "/category/:category_key", module: :categories, as: :category do
        put "/", to: "update#call"
        delete "/", to: "delete#call"

        scope "/maturity_intervals/(:month)/(:year)", module: :maturity_intervals, as: :maturity_intervals do
          post "/", to: "create#call"
          delete "/", to: "delete#call"
        end
      end

      namespace :interval do
        namespace :finalize do
          get "/(:month)/(:year)", to: "index#call"
          post "/events/(:month)/(:year)", to: "events#call", as: :events
        end

        namespace :set_up do
          scope "/:month/:year" do
            get "/", to: "index#call"
            put "/", to: "update#call"
          end
        end
      end

      post "/events/(:month)/(:year)", to: "events/create#call", as: :items_events
      get "/(:month)/(:year)", to: "items/index#call"
    end

    namespace :tokens do
      post "/", to: "create#call"
      delete "/", to: "delete#call"
    end
  end
end
