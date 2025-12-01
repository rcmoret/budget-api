namespace :data do
  scope :budget do
    scope :category do
      get "/:key/recent-summaries/(:limit)",
        to: WebApp::Budget::Categories::SummariesController.action(:call),
        as: :budget_category
    end

    scope :categories do
      get "/:month/:year/create_events",
        to: WebApp::Budget::Categories::CreateEventsController.action(:call),
        as: :budget_category_create_events
    end

    get "/item/:key/events",
      to: WebApp::Budget::Items::EventsIndexController.action(:call),
      as: :budget_item_details
  end
end
