namespace :tokens do
  post "/", to: "create#call"
  delete "/", to: "delete#call"
end
