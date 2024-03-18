module API
  module Budget
    module Events
      class ErrorsSerializer < ApplicationSerializer
        attribute :form_errors
        attribute :events, on_render: :render

        def initialize(errors)
          super(errors.to_hash)
        end

        def form_errors
          fetch("event_type", [])
        end

        def events
          SerializableCollection.new do
            each_with_object([]) do |(key, value), arr|
              arr << EventErrorSerializer.new(key, value) if key.starts_with?("event")
            end
          end
        end
      end
    end
  end
end
