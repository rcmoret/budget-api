module Budget
  module Changes
    class Rollover
      module Presenters
        module Items
          # Rollover item presenters wrap Budget::Details::Base subclasses so
          # they can read the item's `remaining` (the amount available to roll
          # forward) directly off the detail record.
          class BasePresenter
            include EventTypes
            include NumericStringToCents

            def initialize(item, adjustment:)
              @item = item
              @budget_item_key = item.key
              @adjustment = adjustment[:display] || ""
              @adjustment_cents = adjustment[:cents] ||
                                  numeric_string_to_cents(@adjustment).to_i
            end

            attr_reader :item, :adjustment, :adjustment_cents, :budget_item_key

            def updated_amount
              return amount unless valid?

              adjusted_total
            end

            # Rollover items expose a different set of flags than setup: the
            # frontend offers "roll the whole remaining" and "roll none".
            def flags
              {
                rollover_all: rollover_all?,
                rollover_none: none?,
                show_default_suggestion: show_default_suggestion?,
                unreviewed: unreviewed?,
                is_valid: valid?,
              }
            end

            # Offer the "roll the remaining" suggestion on items rolling forward
            # that still have something left to roll. Items already in the
            # upcoming budget (adjusts) are not suggestions.
            def show_default_suggestion?
              return false if adjust?

              !remaining.zero?
            end

            # The adjustment carries the item's full remaining amount forward.
            def rollover_all?
              adjustment_cents == remaining
            end

            # Explicitly reviewed as rolling nothing over. A blank display with
            # zero cents is still unreviewed, so it is not "none".
            def none?
              adjustment_cents.zero? && reviewed?
            end

            # A blank display (no digits) is unreviewed; "0"/"0.0" is reviewed.
            def unreviewed?
              !adjustment.match?(/\d/)
            end

            def reviewed?
              !unreviewed?
            end

            def spent
              item.transaction_detail_total
            end

            def create?
              CREATE_EVENTS.include? event_type
            end

            def adjust?
              ADJUST_EVENTS.include? event_type
            end

            private

            def remaining
              item.remaining
            end

            def valid?
              return false unless numeric_string_to_cents(adjustment).valid?
              return true if adjusted_total.zero?

              (adjusted_total.positive? && revenue?) ||
                (adjusted_total.negative? && expense?)
            end

            def adjusted_total
              adjustment_cents + amount
            end

            def expense? = item.expense?
            def revenue? = !item.expense?
          end

          AdjustPresenter = Class.new(Items::BasePresenter) do
            def previously_budgeted
              0
            end

            def event_type
              EventTypes::ROLLOVER_ITEM_ADJUST
            end

            delegate :amount, to: :item
          end

          CreatePresenter = Class.new(Items::BasePresenter) do
            def previously_budgeted
              item.amount
            end

            def event_type
              EventTypes::ROLLOVER_ITEM_CREATE
            end

            def amount
              0
            end
          end
        end
      end
    end
  end
end
