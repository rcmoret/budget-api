# frozen_string_literal: true

module HasKeyIdentifier
  extend ActiveSupport::Concern

  module LookupMethods
    extend ActiveSupport::Concern

    class_methods do
      def by_key(key)
        find_by(arel_table[:key].lower.eq(key.to_s.strip.downcase))
      end

      def by_key!(key)
        find_by!(arel_table[:key].lower.eq(key.to_s.strip.downcase))
      end
    end
  end

  module ObjectKey
    extend ActiveSupport::Concern

    class_methods do
      def object_prefix(class_name = nil)
        (class_name || to_s).downcase.parameterize(separator: "-")
      end
    end

    delegate :object_prefix, to: :class

    def object_key
      "#{object_prefix}-#{key}"
    end
  end

  module ReadOnly
    extend ActiveSupport::Concern

    include LookupMethods
    include ObjectKey
  end

  include LookupMethods
  include ObjectKey

  included do
    validates :key, uniqueness: true, presence: true, length: { is: 12 }
    validate :key_unchanged!

    scope :by_keys, lambda { |*keys|
      keys.flatten!
      keys.map! { |k| k.to_s.downcase.strip }

      where(arel_table[:key].lower.in(keys))
    }
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
