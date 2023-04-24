module API
  module HasAccount
    extend ActiveSupport::Concern

    included do
      before_action :render_account_not_found, if: -> { account.nil? }
    end

    private

    def account
      @account ||= Account.fetch(api_user, key: account_key)
    end

    def account_key
      params.fetch(:account_key)
    end

    def render_account_not_found
      render json: { account: "not found by key: #{account_key}" }, status: :not_found
    end
  end
end
