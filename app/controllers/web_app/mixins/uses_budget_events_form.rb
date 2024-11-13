# frozen_string_literal: true

module WebApp
  module Mixins
    module UsesBudgetEventsForm
      extend ActiveSupport::Concern
      include Mixins::HasBudgetInterval
      include Mixins::HasRedirectParams

      def call
        if form.save
          redirect_to redirect_path
        else
          redirect_to budget_index_path
        end
      end

      private

      def form
        @form ||= Forms::Budget::EventsForm.new(current_user_profile, events: events_params)
      end

      def events_params
        params.require(:events).map do |event_params|
          event_params.permit(*::Forms::Budget::EventParams::PERMITTED)
        end
      end
    end
  end
end
