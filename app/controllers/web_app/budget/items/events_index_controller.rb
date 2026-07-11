# frozen_string_literal: true

module WebApp
  module Budget
    module Items
      class EventsIndexController < BaseController
        before_action -> { render json: {}, status: :not_found },
          if: -> { budget_item.nil? }

        def call
          # TODO: Revisit serializer implementation. The response was built from
          # the deprecated WebApp::Budget::Items::DetailsSerializer, which is
          # pending reimplementation with Alba. Rendering empty props until then.
          render json: {}
        end

        private

        # Kept because the before_action guard uses it to 404 on a missing item.
        def budget_item
          @budget_item ||=
            ::Budget::Item
            .fetch(current_user_profile, key: params.fetch(:key))
        end
      end
    end
  end
end
