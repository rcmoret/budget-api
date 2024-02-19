# frozen_string_literal: true

module Slugable
  extend ActiveSupport::Concern

  SLUG_FORMAT_MESSAGE = "must be combination of lowercase letters, numbers and dashes"

  # rubocop:disable Rails/I18nLocaleTexts
  included do
    validates :slug, presence: true
    validates :slug, format: { with: /\A[a-z]/, message: "must begin with a lower case letter" }
    validates :slug, format: { with: /\A.[a-z0-9-]*.\z/, message: SLUG_FORMAT_MESSAGE }
    validates :slug, format: { with: /[a-z0-9]\z/, message: "must end with a lower case letter or number" }
    validates :slug, uniqueness: { scope: :user_group_id }
  end
  # rubocop:enable Rails/I18nLocaleTexts

  class_methods do
    def by_slug(slug)
      find_by(arel_table[:slug].lower.eq(slug.to_s.strip.downcase))
    end
  end
end
