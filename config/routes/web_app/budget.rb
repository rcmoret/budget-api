namespace :budget do
  get "/", to: "index#call", as: :home

  put "/category/:key", as: :category, to: "categories/update#call"

  namespace :categories do
    get "/", to: "index#call", as: :index
    post "/", to: "create#call"
  end

  post "/events/(:month)/(:year)", to: "events#call", as: :events

  scope "/:month/:year" do
    get "/", to: "index#call", as: :index
    put "/", to: "update#call"
    post "/", to: "edit#call"
    get "/edit", to: "edit#call"
    get "/set-up", to: "set_up/form#call", as: :set_up_form
    post "/set-up", to: "set_up/create#call"
    get "/finalize", to: "finalize/form#call", as: :finalize_form
    post "/finalize", to: "finalize/create#call"
  end
end
