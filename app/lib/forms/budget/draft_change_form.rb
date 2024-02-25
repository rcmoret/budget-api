# frozen_string_literal: true

module Forms
  module Budget
    class DraftChangeForm
      include ActiveModel::Model

      validates :category_id, presence: true
      validates :amount, numericality: { only_integer: true }

      def initialize(interval, budget_item_key:, budget_category_key:, amount:)
        @interval = interval
        @category_id = ::Budget::Category.fetch(user_group, key: budget_category_key)&.id
        @budget_item_key = budget_item_key
        @amount = amount
      end

      delegate :user_group, to: :interval

      attr_reader :budget_item_key, :amount, :interval, :category_id
    end
  end
end
