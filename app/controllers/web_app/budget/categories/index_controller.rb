# frozen_string_literal: true

module WebApp
  module Budget
    module Categories
      class IndexController < BaseController
        before_action -> { presenter.flash = flash }

        def call
          render inertia: "budget/categories/index", props: serializer.to_h
        end

        private

        def serializer
          IndexSerializer.new(
            presenter,
            params: {
              timezone: current_user_profile.configuration(:timezone),
            }
          )
        end

        def presenter
          @presenter ||=
            ::Presenters::Budget::Categories::CollectionPresenter.new(
              current_user_profile,
              metadata:
            )
        end

        def metadata
          @metadata ||= Presenters::ControllerMetadata.new(
            namespace: "budget",
            prev_selected_account_path:
          )
        end

        def namespace = "budget"
      end
    end
  end
end
