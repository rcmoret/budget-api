# frozen_string_literal: true

module Fetchable
  extend ActiveSupport::Concern

  class_methods do
    def fetch(user_or_group, **find_by)
      case find_by
      in { key: }
        belonging_to(user_or_group).by_key(key)
      in { slug: }
        belonging_to(user_or_group).by_slug(slug)
      end
    end

    def fetch!(user_or_group, **find_by)
      case find_by
      in { key: }
        fetch(user_or_group, key:)
      in { slug: }
        fetch(user_or_group, slug:)
      end.tap do |result|
        raise ActiveRecord::RecordNotFound if result.nil?
      end
    end

    def fetch_collection(user_or_group, keys:)
      belonging_to(user_or_group).by_keys(keys)
    end
  end
end
