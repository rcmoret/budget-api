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

      def props
        {}
      end

      def namespace = "budget"

      def error_component = "budget/dashboard/index"

      def presenter
        @presenter ||=
          Presenters::Budget::Dashboard::IndexPresenter
          .new(interval, metadata)
      end

      def serializer
        @serializer ||=
          WebApp::Budget::Dashboard::Serializer
          .new(presenter)
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
