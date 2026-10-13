namespace :budget do
  namespace :categories do
    get "/", to: "index#call"
  end
end
