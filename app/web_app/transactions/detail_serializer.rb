# frozen_string_literal: true

module WebApp
  module Transactions
    class DetailSerializer < ::Serializers::GenericSerializer
      attributes :key, :object_key
      attributes amount: :money
      attribute(:budget_item_key) { |detail| detail.budget_item&.key }
      attribute(:budget_category_name) do |detail|
        detail.budget_item&.name.presence || "-"
      end
      attribute(:icon_class_name) do |detail|
        detail.budget_item&.category&.icon_class_name
      end
      attribute(:budget_item_href) do |detail|
        item = detail.budget_item

        if item.present?
          Rails.application.routes.url_helpers.budget_items_path(
            month: item.interval.month,
            year: item.interval.year,
            category_slug: item.category.slug
          )
        end
      end
    end
  end
end
