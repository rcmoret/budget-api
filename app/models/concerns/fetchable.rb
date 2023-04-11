# frozen_string_literal: true

module Fetchable
  extend ActiveSupport::Concern

  class_methods do
    def fetch(user:, key:)
      belonging_to(user).by_key(key)
    end

    def fetch_collection(user:, keys:)
      belonging_to(user).by_keys(keys)
    end
  end
end
