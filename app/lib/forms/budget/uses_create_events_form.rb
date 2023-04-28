module Forms
  module Budget
    module UsesCreateEventsForm
      extend ActiveSupport::Concern
      include ActiveModel::Model

      included do
        validate :events_form_valid!
      end

      def save
        raise NotImplemented
      end

      private

      def events_form
        raise NotImplemented
      end

      def with_transaction
        return false unless valid?

        ApplicationRecord.transaction do
          yield
          save_events

          raise ActiveRecord::Rollback if errors.any?
        end

        errors.none?
      end

      def save_events
        return if events_form.save

        promote_errors(events_form)
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
