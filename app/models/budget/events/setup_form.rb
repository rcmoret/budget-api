module Budget
  module Events
    class SetupForm
      include Forms::Budget::UsesCreateEventsForm

      validate :interval_needs_setup!

      def initialize(user:, interval:, **options)
        @events_form = Forms::Budget::EventsForm.new(user, events: options.delete(:events))
        @interval = interval
        @options = default_options.merge(options)
      end

      def save
        with_transaction { update_interval }
      end

      private

      attr_reader :interval, :options, :events_form

      def update_interval
        return if interval.update(options)

        promote_errors(interval)
      end

      def default_options
        {
          start_date: interval.first_date,
          end_date: interval.last_date,
          set_up_completed_at: Time.current,
        }
      end

      def interval_needs_setup!
        return unless interval.set_up?

        errors.add(:interval, "has already been set up")
      end
    end
  end
end
