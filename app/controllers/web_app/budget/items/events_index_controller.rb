# frozen_string_literal: true

module WebApp
  module Budget
    module Items
      class EventsIndexController < BaseController
        before_action -> { render json: {}, status: :not_found },
                      if: -> { budget_item.nil? }

        def call
          render json: serializer.render
        end

        private

        def serializer
          IndividualSerializer.new(
            key: "budget_item",
            serializable: budget_item_serializer
          )
        end

        def budget_item
          @budget_item ||=
            ::Budget::Item
            .fetch(current_user_profile, key: params.fetch(:key))
        end

        def budget_item_serializer
          API::Budget::Items::DetailsSerializer.new(budget_item)
        end
      end
    end
  end
end
