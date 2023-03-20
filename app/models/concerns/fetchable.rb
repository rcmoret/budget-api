# frozen_string_literal: true

module Fetchable
  extend ActiveSupport::Concern

  class_methods do
    def fetch(user:, slug: nil, key: nil)
      raise StandardError if slug.nil? && key.nil?

      if key.present?
        belonging_to(user).by_key(key)
      else
        belonging_to(user).by_slug(slug)
      end
    end
  end
end
