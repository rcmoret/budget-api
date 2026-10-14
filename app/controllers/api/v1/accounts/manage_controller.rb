module API
  module V1
    module Accounts
      class ManageController < BaseController
        def call
          render json: ManageSerializer
            .new(accounts)
            .serialize(root_key: :accounts)
        end

        private

        def accounts
          ::Account
            .belonging_to(current_api_user)
            .by_priority
            .with_balance
        end
      end
    end
  end
end
