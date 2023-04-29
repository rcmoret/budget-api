module Forms
  module Budget
    class FinalizeIntervalForm
      include UsesCreateEventsForm

      validate :interval_needs_close_out!

      def initialize(user:, interval:, **options)
        @events_form = EventsForm.new(user, events: options.delete(:events))
        @interval = interval
        @options = default_options.merge(options)
      end

      def save
        with_transaction { update_interval }
      end

      private

      attr_reader :interval, :events_form, :options

      def update_interval
        return if interval.update(options)

        promote_errors(interval)
      end

      def default_options
        { close_out_completed_at: Time.current }
      end

      def interval_needs_close_out!
        return unless interval.closed_out?

        errors.add(:interval, "has already been finalized")
      end
    end
  end
end
