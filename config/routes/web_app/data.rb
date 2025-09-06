namespace :data do
  scope :budget do
    scope :category do
      get "/:key/recent-summaries/(:limit)",
        to: WebApp::Budget::Categories::SummariesController.action(:call),
        as: :budget_category
    end

    get "/item/:key/events",
      to: WebApp::Budget::Items::EventsIndexController.action(:call),
      as: :budget_item_details
  end
end
