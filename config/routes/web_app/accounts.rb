namespace :accounts do
  get "/", to: "index#call", as: :index
  post "/", to: "create#call"
  get "/manage", to: "manage#call", as: :manage
  post "/transfer", to: "transfers/create#call"
end

put "/account/:key", to: "accounts/update#call", as: :account_update

scope "account/:slug", module: :transactions, as: :transactions do
  get "/transactions/(:month)/(:year)", to: "index#call", as: :index
  post "/transaction", to: "create#call", as: :create
  put "/transaction/:key/(:month)/(:year)", to: "update#call", as: :update
  delete "/transaction/:key/receipt", to: "delete_receipt#call", as: :delete_receipt
  delete "/transaction/:key", to: "delete#call", as: :show
end
