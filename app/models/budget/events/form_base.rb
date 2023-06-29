module Budget
  module Events
    class FormBase
      include ActiveModel::Model
      include EventTypes

      def initialize(current_user, params)
        @current_user = current_user
        @event_type = params[:event_type]
        @budget_item_key = params[:budget_item_key]
        @data = params[:data]
        @key = params.fetch(:key) { SecureRandom.hex(6) }
      end

      attr_reader :key

      private

      def event
        @event ||= Budget::ItemEvent.new(user: current_user,
                                         item: budget_item,
                                         type: budget_item_event_type,
                                         data: data,
                                         key: key,
                                         amount: event_amount,)
      end

      def budget_item
        raise NotImplementedError
      end

      def budget_item_event_type
        raise NotImplementedError
      end

      def event_amount
        raise NotImplementedError
      end

      def promote_errors(model_errors)
        model_errors.each do |error|
          errors.add(error.attribute, error.message)
        end
      end

      attr_reader :current_user, :event_type, :budget_item_key, :data

      class << self
        def applies?(event_type)
          applicable_event_types.include?(event_type)
        end

        protected

        def applicable_event_types
          raise NotImplementedError
        end
      end
    end
  end
end
