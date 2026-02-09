# frozen_string_literal: true

module WebApp
  module Budget
    module Categories
      class CreateEventsController < BaseController
        include Mixins::Data::HasBudgetInterval

        def call
          render json: { events: }, status: :ok
        end

        private

        def events
          ::Budget::CreateEventsService.call(
            interval:,
            **params
              .permit(:event_context, scopes: [], excluded_keys: [])
              .to_h
              .symbolize_keys,
          )
        end
      end
    end
  end
end
