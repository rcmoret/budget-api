# frozen_string_literal: true

module Fetchable
  extend ActiveSupport::Concern

  class_methods do
    def fetch(user_or_group, key:)
      belonging_to(user_or_group).by_key(key)
    end

    def fetch_collection(user_or_group, keys:)
      belonging_to(user_or_group).by_keys(keys)
    end
  end
end
