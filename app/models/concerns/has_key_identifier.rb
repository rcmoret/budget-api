# frozen_string_literal: true

module HasKeyIdentifier
  extend ActiveSupport::Concern

  included do
    validates :key, uniqueness: true, presence: true, length: { is: 12 }
    validate :key_unchanged!

    scope :by_keys, lambda { |*keys|
      keys.map! { |k| k.to_s.downcase.strip }

      where(arel_table[:key].lower.in(keys))
    }
  end

  class_methods do
    def by_key(key)
      find_by(arel_table[:key].lower.eq(key.to_s.strip.downcase))
    end

    def by_key!(key)
      find_by!(arel_table[:key].lower.eq(key.to_s.strip.downcase))
    end

    def generate_key
      KeyGenerator.call
    end
  end

  private

  def key_unchanged!
    return unless persisted? && key_changed?

    errors.add(:key, "cannot change an existing key")
  end

  def generate_key
    self.class.generate_key
  end
end
