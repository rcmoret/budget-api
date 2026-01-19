# frozen_string_literal: true

module WebApp
  module Mixins
    module UsesBudgetEventsForm
      extend ActiveSupport::Concern
      include Mixins::HasBudgetInterval
      include Mixins::HasRedirectParams

      included do
        before_action -> { @effective_timestamp = Time.current }
        after_action -> { change_set.update(effective_at: @effective_timestamp) },
                     if: -> { form.errors.none? }
      end

      def call
        if form.save
          redirect_to redirect_path
        else
          render inertia: error_component, props: page_props
        end
      end

      private

      def props
        API::Budget::Interval::SetUp::CategoriesSerializer.new(interval).render.merge(
          errors: form_errors
        )
      end

      def form_errors
        form.errors.to_hash.reduce([]) do |arr, (key, vals)|
          arr << vals.reduce(key: key, &:merge)
        end
      end

      def form
        @form ||= Forms::Budget::EventsForm.new(
          current_user_profile,
          change_set,
          events: events_params
        )
      end

      def events_params
        params.require(:events).map do |event_params|
          event_params.permit(*::Forms::Budget::EventParams::PERMITTED)
        end
      end
    end
  end
end
