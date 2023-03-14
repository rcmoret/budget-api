module User
  class Event < ApplicationRecord
    include HasKeyIdentifier

    belongs_to :actor, class_name: "User::Account"
    belongs_to :target_user, class_name: "User::Account"
    belongs_to :user_event_type, class_name: "EventType"

    alias_attribute :event_type, :user_event_type

    def data
      case self[:data]
      in Hash
        self[:data].deep_symbolize_keys
      in Array
        self[:data].map(&:deep_symbolize_keys)
      end
    end
  end
end
