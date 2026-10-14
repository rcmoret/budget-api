namespace :accounts do
  get "/", to: "index#call"
  get "/manage", to: "manage#call"
end
