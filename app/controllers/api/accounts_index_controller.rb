module API
  class AccountsIndexController < API::BaseController
    def call
      render json: User::AccountsSerializer.new(api_user).render
    end
  end
end
