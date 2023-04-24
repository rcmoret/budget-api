module Budget
  module Events
    class SetupForm
      include ActiveModel::Model

      validate :interval_needs_setup!
      validate :events_form_valid!

      def initialize(user:, interval:, **options)
        @events_form = Budget::Events::Form.new(user, events: options.delete(:events))
        @interval = interval
        @options = default_options.merge(options)
      end

      def save
        return false unless valid?

        ApplicationRecord.transaction do
          update_interval
          save_events

          raise ActiveRecord::Rollback if errors.any?
        end

        errors.none?
      end

      private

      attr_reader :interval, :events_form, :options

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

      def save_events
        return if events_form.save

        promote_errors(events_form)
      end

      def interval_needs_setup!
        return unless interval.set_up?

        errors.add(:interval, "has already been set up")
      end

      def events_form_valid!
        return if events_form.valid?

        promote_errors(events_form)
      end

      def promote_errors(object)
        object.errors.each do |error|
          errors.add(error.attribute, error.full_message)
        end
      end
    end
  end
end
