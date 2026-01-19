module Budget
  class ChangeSet < ApplicationRecord
    include HasKeyIdentifier
    include BelongsToUserGroup::Through[association: :interval, class_name: "Budget::Interval"]

    TYPE_MAP = [
      { type: :adjust, key: 10 },
      { type: :pre_setup, key: -10 },
      { type: :rollover, key: 20 },
      { type: :setup, key: 0 },
    ].freeze

    enum :type_key,
         TYPE_MAP.to_h(&:values)

    belongs_to :interval,
               class_name: "Interval",
               inverse_of: :change_sets,
               foreign_key: :budget_interval_id
    alias_attribute :interval_id, :budget_interval_id

    after_initialize :set_type_key!
    after_initialize -> { assign_attributes(key: KeyGenerator.call) if key.blank? }

    has_many :events,
             dependent: :destroy,
             foreign_key: :budget_change_set_id,
             inverse_of: :change_set,
             class_name: "ItemEvent"

    scope :incomplete, -> { where(effective_at: nil) }

    def self.start_setup!
      setup.start!
    end

    def set_type_key!
      self.type_key = TYPE_MAP.reduce(nil) do |memo, hash|
        if hash[:type] == self.class.to_s.split("::").last.downcase.to_sym
          hash[:key]
        else
          memo
        end
      end
    end

    def incomplete?
      effective_at.nil?
    end

    delegate :month, :year, to: :interval
  end
end
