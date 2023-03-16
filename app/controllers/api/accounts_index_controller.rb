module API
  class AccountsIndexController < API::BaseController
    def call
      render json: { accounts: [] }
    end
  end
end
