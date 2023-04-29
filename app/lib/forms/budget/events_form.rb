module Forms
  module Budget
    class EventsForm
      include ActiveModel::Model

      validate :all_valid_event_types

      def initialize(current_user, events_data)
        @current_user = current_user
        @events_data = events_data.symbolize_keys.fetch(:events, [{}])
      end

      def save
        return false unless valid?

        ::Budget::ItemEvent.transaction { save_all! }

        errors.none?
      end

      private

      def save_all!
        forms.each do |form|
          next if form.save

          promote_errors(form)
        end

        raise ActiveRecord::Rollback if errors.any?
      end

      def all_valid_event_types
        events_data.each do |event_data|
          type = event_data[:event_type]
          next if form_gateway.handler_registered?(type)

          errors.add(:event_type, "No registered handler for #{type}")
        end
      end

      def forms
        @forms ||= events_data.map { |event_data| form_gateway.form_for(current_user, event_data) }
      end

      def promote_errors(model)
        model.errors.each do |error|
          errors.add("#{model}.#{model.key}", { error.attribute => error.message })
        end
      end

      def form_gateway
        ::Budget::Events::FormGateway
      end

      attr_reader :current_user, :events_data
    end
  end
end
