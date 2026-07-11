namespace :budget do
  get "/",
    to: WebApp::Budget::DashboardController.action(:call)
  get "(/:month/:year)",
    to: WebApp::Budget::DashboardController.action(:call),
    as: :dashboard

  get "/categories",
    to: WebApp::Budget::Categories::IndexController.action(:call),
    as: :categories

  namespace :category, module: :categories do
    put "/:slug",
      to: WebApp::Budget::Categories::UpdateController.action(:call)
    post "/",
      to: WebApp::Budget::Categories::CreateController.action(:call)
  end

  post "/events/(:month)/(:year)",
    to: WebApp::Budget::EventsController.action(:call),
    as: :create_events

  scope "/:month/:year" do
    put "/",
      to: WebApp::Budget::UpdateController.action(:call)

    # edit is future state
    # post "/", to: "edit#call"
    # get "/edit", to: "edit#call"


    scope "/set-up" do
      get "(/:slug)",
          to: WebApp::Budget::Setup::CategoryFormController.action(:call),
          as: :setup_form
      post "/",
        to: WebApp::Budget::Setup::CreateEventsController.action(:call),
        as: :finish_setup
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

    scope "/roll-over" do
      get "(/:slug)",
          to: WebApp::Budget::Rollover::FormController.action(:call),
          as: :rollover_form
    end

    get "/finalize", to: WebApp::Budget::Finalize::FormController.action(:call), as: :finalize_form
    post "/finalize", to: WebApp::Budget::Finalize::CreateEventsController.action(:call)
  end
end
