module API
  module V1
    module Accounts
      class IndexController < BaseController
        def call
          render json: IndexSerializer
            .new(accounts)
            .serialize(root_key: :accounts)
        end

        private

        def accounts
          ::Account
            .belonging_to(current_api_user)
            .by_priority
            .with_balance
            .then { |scope| include_archived? ? scope : scope.active }
        end

        def include_archived?
          ActiveModel::Type::Boolean.new.cast(params[:include_archived])
        end
      end
    end
  end
end
