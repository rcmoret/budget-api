# frozen_string_literal: true

module WebApp
  module Budget
    class UpdateController < BaseController
      include Mixins::HasBudgetInterval
      include Mixins::HasRedirectParams

      def call
        if interval.update(update_params)
          redirect_to redirect_path
        else
          render inertia: error_component, props: page_props
        end
      end

      private

      def props
        update_params.to_h.merge(errors: interval.errors)
      end

      def update_params
        params
          .require(:interval)
          .permit(:start_date, :end_date)
      end

      def redirect_params
        params.require(:redirect).permit(segments: [])[:segments]
      end

      def namespace = "budget"
    end
  end
end
