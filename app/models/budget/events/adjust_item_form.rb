# frozen_string_literal: true

module Budget
  module Events
    class AdjustItemForm < FormBase
      include ActiveModel::Model
      include EventTypes
      include Messages

      APPLICABLE_EVENT_TYPES = [
        ITEM_ADJUST,
        ROLLOVER_ITEM_ADJUST,
        SETUP_ITEM_ADJUST,
      ].freeze

      def self.applicable_event_types
        APPLICABLE_EVENT_TYPES
      end

      validates :event_type, inclusion: { in: APPLICABLE_EVENT_TYPES }
      validates :amount, numericality: { only_integer: true }
      validates :budget_item, presence: true
      validates :amount,
                numericality: {
                  less_than_or_equal_to: 0,
                  message: EXPENSE_AMOUNT_VALIDATION_MESSAGE,
                },
                if: :expense?
      validates :amount,
                numericality: {
                  greater_than_or_equal_to: 0,
                  message: REVENUE_AMOUNT_VALIDATION_MESSAGE,
                },
                if: :revenue?

      def initialize(params)
        @amount = params[:amount]
        @budget_item_id = params[:budget_item_id]
        @event_type = params[:event_type]
        @data = params[:data]
      end

      delegate :expense?, :revenue?, to: :budget_item, allow_nil: true

      def save
        return false unless valid?
        return true if event.save

        promote_errors(event.errors)
        false
      end

      def attributes
        { item: item_attributes }
      end

      def to_s
        'adjust_item_form'
      end

      private

      def event
        @event ||= Budget::ItemEvent.new(
          type_id: type_id,
          item_id: budget_item.id,
          data: data,
          amount: adjustment_amount
        )
      end

      def budget_item
        @budget_item ||= Budget::ItemView.find_by(id: budget_item_id)
      end

      def adjustment_amount
        @adjustment_amount ||= amount.to_i - budget_item.amount
      end

      def type_id
        @type_id ||= Budget::ItemEventType.for(event_type).id
      end

      def item_attributes
        budget_item
          .reload
          .attributes
          .merge(events: [event.attributes])
      end

      def promote_errors(model_errors)
        model_errors.each do |attribute, message|
          errors.add(attribute, message)
        end
      end

      attr_reader :amount
      attr_reader :budget_item_id
      attr_reader :event_type
      attr_reader :data

      FormBase.register!(self)
    end
  end
end
