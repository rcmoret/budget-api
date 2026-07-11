# frozen_string_literal: true

module WebApp
  module Transactions
    module Serializers
      class DetailSerializer < GenericSerializer
        attributes :key
        one :amount, resource: MonetaryAmountSerializer
        attribute(:budget_item_key) { |detail| detail.budget_item&.key }
        attribute(:budget_category_name) do |detail|
          detail.budget_item&.name.presence || "-"
        end
        attribute(:icon_class_name) do |detail|
          detail.budget_item&.category&.icon_class_name
        end
      end
    end
  end
end
