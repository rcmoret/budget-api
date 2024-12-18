namespace :accounts do
  get "/", to: "index#call"
  post "/", to: "create#call"
  post "transfers/(:month)/(:year)", to: "transfers/create#call", as: :transfers
  delete "/transfer/:transfer_key/(:month)/(:year)", to: "transfers/delete#call", as: :transfer
end

scope "/account/:account_key", module: :accounts, as: :account do
  put "/", to: "update#call"
  delete "/", to: "delete#call"

  scope "transactions/(:month)/(:year)", module: :transactions, as: :transactions do
    get "/", to: "index#call"
    post "/", to: "create#call"
  end

  namespace :transaction, module: :transactions, as: :transaction do
    put "/:key/(:month)/(:year)", to: "update#call"
    delete "/:key/(:month)/(:year)", to: "delete#call"
  end
end
