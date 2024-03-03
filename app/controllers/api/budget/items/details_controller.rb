module API
  module Budget
    module Items
      class DetailsController < BaseController
        before_action :render_not_found, if: -> { item.blank? }

        def call
          render json: serializer.render, status: :ok
        end

        private

        def item
          @item ||= ::Budget::Item.fetch(api_user, key: item_key)
        end

        def item_key
          params.fetch(:item_key)
        end

        def serializer
          DetailsSerializer.new(item)
        end

        def render_not_found
          render json: { item: "not found by #{item_key}" }, status: :not_found
        end
      end
    end
  end
end
