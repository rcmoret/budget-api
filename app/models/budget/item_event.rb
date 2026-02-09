# frozen_string_literal: true

module Budget
  class ItemEvent < ApplicationRecord
    include EventTypes
    include HasKeyIdentifier

    belongs_to :user,
      class_name: "User::Profile"
    belongs_to :item,
      class_name: "Item",
      foreign_key: :budget_item_id,
      inverse_of: :events
    belongs_to :type,
      class_name: "ItemEventType",
      foreign_key: :budget_item_event_type_id,
      inverse_of: :events
    belongs_to :change_set,
      class_name: "ChangeSet",
      foreign_key: :budget_change_set_id,
      inverse_of: :events

    alias_attribute :type_id, :budget_item_event_type_id
    alias_attribute :item_id, :budget_item_id

    validates :type_id,
      uniqueness: { scope: :item_id },
      if: :item_create?
    validates :type_id,
      uniqueness: { scope: :item_id },
      if: :item_delete?
    validates :change_set,
      presence: true,
      if: -> { (created_at || Time.current).year > 2025 }
    validate :validate_json_data, if: :data_present?

    scope :prior_to, lambda { |date_hash|
      joins(:item).merge(Item.prior_to(date_hash))
    }
    scope :adjust_events, -> { joins(:type).merge(ItemEventType.adjust_scope) }
    scope :create_events, -> { joins(:type).merge(ItemEventType.create_scope) }
    scope :delete_events, -> { joins(:type).merge(ItemEventType.delete_scope) }
    scope :previously_budgeted, lambda {
      joins(:type).merge(ItemEventType.rollover)
    }
    scope :currently_budgeted, lambda {
      joins(:type).merge(ItemEventType.non_rollover)
    }

    VALID_EVENT_TYPES.each do |event_type|
      scope event_type.to_sym, -> { where(type: ItemEventType.for(event_type)) }
    end

    delegate :name, to: :type, prefix: true
    delegate :present?, to: :data, prefix: true

    def item_create?
      CREATE_EVENTS.include?(type.name)
    end

    def item_delete?
      DELETE_EVENTS.include?(type.name)
    end

    def budget_item_key=(item_key)
      self.budget_item_id = Budget::Item.fetch(user_group, key: item_key)&.id
    end

    private

    def validate_json_data
      case data
      when nil, Hash
        nil
      when String
        self[:data] = JSON.parse(data)
      when Array
        self[:data] = { event_data: data }
      end
    rescue JSON::ParserError
      errors.add(:data, "provided a string that was not valid JSON")
    end
  end
end
