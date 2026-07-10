post "/account", to: WebApp::Accounts::CreateController.action(:call)

namespace :accounts do
  get "/",
    as: "",
    to: WebApp::Accounts::IndexController.action(:call)
  post "/",
    to: WebApp::Accounts::CreateController.action(:call)
  post "/transfer",
    to: WebApp::Accounts::Transfers::CreateController.action(:call)
end

put "/account/:key",
  to: WebApp::Accounts::UpdateController.action(:call), as: :account_update

scope "account/:slug", module: :transactions, as: :transactions do
  get "/transactions/(:month)/(:year)",
    to: WebApp::Transactions::IndexController.action(:call),
    as: ""
  post "/transaction",
    to: WebApp::Transactions::CreateController.action(:call),
    as: :create
  put "/transaction/:key/(:month)/(:year)",
    to: WebApp::Transactions::UpdateController.action(:call),
    as: :update
  delete "/transaction/:key/receipt",
    to: WebApp::Transactions::DeleteReceiptController.action(:call),
    as: :delete_receipt
  delete "/transaction/:key",
    to: WebApp::Transactions::DeleteController.action(:call),
    as: :show
end
