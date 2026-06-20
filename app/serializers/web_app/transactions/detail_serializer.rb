module WebApp
  module Transactions
    class DetailSerializer
      include Alba::Resource
      attributes :key
      one :amount, resource: MonetaryAmountSerializer
      attribute(:budget_item_key) { |detail| detail.budget_item&.key }
      attribute(:budget_category_name) do |detail|
        detail.budget_item&.name.presence || "-"
      end
      attribute(:icon_class_name) do |detail|
        detail.budget_item&.category&.icon_class_name
      end

      transform_keys :lower_camel
    end
  end
end
