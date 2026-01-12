module Forms
  module Budget
    class EventsForm
      include ActiveModel::Model

      validate :all_valid_event_types

      def initialize(current_user, change_set, events_data)
        @current_user = current_user
        @events_data = events_data.symbolize_keys.fetch(:events, [{}])
        @change_set = change_set
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
        @forms ||= events_data.map { |event_data| form_gateway.form_for(current_user, change_set, event_data) }
      end

      def promote_errors(model)
        model_errors = model.errors.each_with_object(Hash.new { |h, k| h[k] = [] }) do |error, memo|
          memo[error.attribute] << error.message
        end
        model_errors.each_pair do |key, value|
          errors.add(model.key, { key => value })
        end
      end

      def form_gateway
        Events::FormGateway
      end

      attr_reader :current_user, :events_data, :change_set
    end
  end
end
