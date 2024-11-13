# frozen_string_literal: true

module HasKeyIdentifier
  extend ActiveSupport::Concern

  included do
    validates :key, uniqueness: true, presence: true, length: { is: 12 }
    validate :key_unchanged!
  end

  class_methods do
    def by_key(key)
      find_by(arel_table[:key].lower.eq(key.to_s.strip.downcase))
    end

    def by_key!(key)
      find_by!(arel_table[:key].lower.eq(key.to_s.strip.downcase))
    end

    def by_keys(keys)
      where(arel_table[:key].lower.in(keys.map(&:to_s).map(&:strip).map(&:downcase)))
    end
  end

  private

  def key_unchanged!
    return unless persisted? && key_changed?

    errors.add(:key, "cannot change an existing key")
  end
end
