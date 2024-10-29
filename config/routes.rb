Rails.application.routes.draw do
  root "home#index"
  devise_for :user_profiles, class_name: "User::Profile"

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

      get "/item/:item_key/details", as: :item_details, to: "items/details#call"

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

        get "/draft/(:month)/(:year)", to: "draft#call", as: :draft
      end

      post "/events/(:month)/(:year)", to: "events/create#call", as: :items_events
      get "/(:month)/(:year)", to: "items/index#call"
    end

    namespace :tokens do
      post "/", to: "create#call"
      delete "/", to: "delete#call"
    end
  end

  scope "/", module: :web_app do
    get "/home", to: "home#call", as: :home

    namespace :accounts do
      get "/", to: "index#call", as: :index
    end

    scope "account/:slug", module: :transactions, as: :transactions do
      get "/transactions/(:month)/(:year)", to: "index#call", as: :index
      put "/transaction/:key/(:month)/(:year)", to: "update#call", as: :update
    end

    namespace :budget do
      scope "/categories", module: :categories, as: :categories do
        get "/", to: "index#call", as: :index
      end
      get "/(:month)/(:year)", to: "index#call", as: :index
      put "/(:month)/(:year)", to: "update#call"
    end
  end
end
