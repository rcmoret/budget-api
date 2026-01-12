namespace :budget do
  get "/", to: "index#call", as: :home

  namespace :category, module: :categories do
    put "/:key", to: "update#call", as: :update
    get "/:slug", to: "show#call", as: :show
  end

  namespace :categories do
    get "/", to: "index#call", as: :index
    post "/", to: "create#call"
  end

  post "/events/(:month)/(:year)", to: "events#call", as: :events

  get "(/:month)(/:year)", to: "index#call", as: :index

  scope "/:month/:year" do
    put "/", to: "update#call"
    post "/", to: "edit#call"
    get "/edit", to: "edit#call"


    scope "/set-up" do
      get "(/:slug)",
          to: WebApp::Budget::Setup::CategoryFormController.action(:call),
          as: :setup_form
      post "/",
        to: WebApp::Budget::Setup::CreateEventsController.action(:call)
      post "/:slug/new-event",
           to: WebApp::Budget::Setup::AddEventController.action(:call)
      put "/:slug",
          to: WebApp::Budget::Setup::UpdateEventController.action(:call)
      delete "/:slug/:key",
             to: WebApp::Budget::Setup::RemoveEventController.action(:call)
      # reset
      delete "/",
        to: WebApp::Budget::Setup::CategoryFormResetController.action(:call)
    end
    get "/finalize", to: "finalize/form#call", as: :finalize_form
    post "/finalize", to: "finalize/create_events#call"
  end
end
