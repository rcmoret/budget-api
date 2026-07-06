# frozen_string_literal: true

module WebApp
  module Budget
    class IndexController < BaseController
      include Mixins::HasBudgetInterval

      before_action -> { presenter.flash = flash }

      def call
        render inertia: "budget/dashboard/index", props: serializer.to_h
      end

      private

      def presenter
        @presenter ||=
          Presenters::Budget::Dashboard::IndexPresenter
          .new(interval, metadata)
      end

      def serializer
        @serializer ||=
          WebApp::Budget::Dashboard::Serializer
          .new(
            presenter,
            params: {
              current_user_profile:,
              namespace: "budget",
              month:,
              year:,
            }
          )
      end

      def metadata
        @metadata ||= Presenters::ControllerMetadata.new(
          namespace: "budget",
          prev_selected_account_path:
        )
      end
    end
  end
end
