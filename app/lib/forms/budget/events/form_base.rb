module Forms
  module Budget
    module Events
      class FormBase
        include ActiveModel::Model
        include ::Budget::EventTypes

        def initialize(current_user, change_set, params)
          @current_user = current_user
          @event_type = params[:event_type]
          @budget_item_key = params[:budget_item_key]
          @data = params[:data]
          @key = params.fetch(:key) { KeyGenerator.call }
          @change_set = change_set
        end

        attr_reader :key, :change_set

        private

        def event
          @event ||= ::Budget::ItemEvent.new(
            user: current_user,
            item: budget_item,
            type: budget_item_event_type,
            data:,
            change_set:,
            key:,
            amount: event_amount,
          )
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
end
