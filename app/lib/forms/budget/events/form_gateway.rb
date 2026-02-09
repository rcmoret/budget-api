module Forms
  module Budget
    module Events
      class FormGateway
        REGISTERED_CLASSES = [
          AdjustItemForm,
          CreateItemForm,
          DeleteItemForm,
        ].freeze

        REGISTERED_EVENT_TYPES = REGISTERED_CLASSES.reduce([]) do |list, klass|
          if list.intersect?(klass.applicable_event_types)
            raise DuplicateEventTypeRegistrationError
          end

          [ *list, *klass.applicable_event_types.dup ]
        end.freeze

        class << self
          def handler_registered?(event_type)
            REGISTERED_EVENT_TYPES.include?(event_type)
          end

          def form_for(current_user, change_set, event)
            event_type = event.fetch(:event_type)
            form_class = REGISTERED_CLASSES.find do |potential_hanlder|
              potential_hanlder.applies?(event_type)
            end

            unless form_class.nil?
              return form_class.new(
                current_user,
                change_set,
                event
              )
            end

            raise MissingFormClassError,
              "no form_class register for #{event_type}"
          end
        end

        MissingFormClassError = Class.new(StandardError)
        DuplicateEventTypeRegistrationError = Class.new(StandardError)
      end
    end
  end
end
