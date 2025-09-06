namespace :data do
  scope :budget do
    scope :category do
      get "/:key/recent-summaries/(:limit)",
        to: WebApp::Budget::Categories::SummariesController.action(:call),
        as: :budget_category
    end
  end
end
