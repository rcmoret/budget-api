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
