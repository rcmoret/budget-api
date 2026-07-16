# frozen_string_literal: true

module WebApp
  module Budget
    module Changes
      module Serializers
        class NotificationsSerializer
          include ::Budget::EventTypes

          def initialize(events:)
            @events = events
          end

          def to_h
            { notifications: to_array }.deep_transform_keys do |key|
              key.to_s.camelize(:lower)
            end
          end

          def to_array
            events.map do |event|
              case event.type_name
              when *CREATE_EVENTS
                "#{event.item.name} item added"
              when *ADJUST_EVENTS
                next if event.amount.to_i.zero?

                "#{event.item.name} item adjusted"
              when *DELETE_EVENTS
                "#{event.item.name} item deleted"
              end
            end
          end

          attr_reader :events
        end
      end
    end
  end
end
