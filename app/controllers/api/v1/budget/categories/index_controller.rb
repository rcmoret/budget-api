module API
  module V1
    module Budget
      module Categories
        class IndexController < BaseController
          def call
            render json: WebApp::Budget::Categories::IndexSerializer
              .new(categories, params: { timezone: Time.zone })
              .serialize(root_key: :categories)
          end

          private

          def categories
            ::Budget::Category
              .includes(:icon)
              .belonging_to(current_api_user)
              .order(:name)
          end
        end
      end
    end
  end
end
