# frozen_string_literal: true

module Budget
  class ItemEventType < ApplicationRecord
    include EventTypes

    validates :name,
              uniqueness: true,
              inclusion: { in: VALID_EVENT_TYPES }
    has_many :events, class_name: "ItemEvent", dependent: :restrict_with_exception

    VALID_EVENT_TYPES.each do |event_type|
      define_singleton_method event_type.to_sym do
        self.for(event_type)
      end
    end

    scope :adjust_scope, -> { where(name: ADJUST_EVENTS) }
    scope :create_scope, -> { where(name: CREATE_EVENTS) }
    scope :delete_scope, -> { where(name: DELETE_EVENTS) }
    scope :rollover, -> { where(name: ROLLOVER_EVENTS) }
    scope :non_rollover, -> { where(name: NON_ROLLOVER_EVENTS) }

    def self.for(type_name)
      find_or_create_by!(name: type_name.to_s)
    end
  end
end
