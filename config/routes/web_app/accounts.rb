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
put "/account/:key/priority",
  to: WebApp::Accounts::UpdateController.action(:reprioritize), as: :account_reprioritize

scope "account/:slug" do
  scope "/", as: :account do
    get "/edit",
      to: WebApp::Accounts::EditController.action(:call),
      as: :edit
  end
end

get "/account/:slug/transactions/(:month/:year)",
  to: WebApp::Transactions::IndexController.action(:call),
  as: :transactions

scope "account/:slug/transaction", as: :transactions do
  post "/",
    to: WebApp::Transactions::CreateController.action(:call),
    as: :create
  put "/:key/(:month)/(:year)",
    to: WebApp::Transactions::UpdateController.action(:call),
    as: :update
  delete "/:key/receipt",
    to: WebApp::Transactions::DeleteReceiptController.action(:call),
    as: :delete_receipt
  delete "/:key",
    to: WebApp::Transactions::DeleteController.action(:call),
    as: :show
end
