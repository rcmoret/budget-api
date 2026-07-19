module Budget
  module Changes
    class Setup
      module Presenters
        module Items
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

            attr_reader :adjustment,
              :adjustment_cents,
              :budget_item_key,
              :item

            def updated_amount
              return amount unless valid?

              adjusted_total
            end

            def flags
              {
                eq_prev_budgeted: eq_prev_budgeted?,
                eq_prev_spent: eq_prev_spent?,
                has_delete_intent: will_delete?,
                is_valid: valid?,
                show_default_suggestion: show_default_suggestion?,
                unreviewed: unreviewed?,
              }
            end

            def reviewed?
              !unreviewed? && valid?
            end

            def create?
              CREATE_EVENTS.include? event_type
            end

            def adjust?
              ADJUST_EVENTS.include? event_type
            end

            private

            def eq_prev_budgeted?
              adjustment_cents == previously_budgeted
            end

            def eq_prev_spent?
              previously_budgeted == spent
            end

            def show_default_suggestion?
              return false unless monthly? || category.accrual?
              return false if adjust?
              return false if category.default_amount.abs.zero?

              eq_prev_spent? || category.accrual?
            end

            def spent = 0

            def will_delete?
              return false if create?

              updated_amount.zero?
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

            delegate :category,
              :expense?,
              :monthly?,
              :object_key,
              :revenue?,
              :spent,
              to: :item
          end
        end

        AdjustPresenter = Class.new(Items::BasePresenter) do
          include NumericStringToCents

          def previously_budgeted
            0
          end

          def event_type
            EventTypes::SETUP_ITEM_ADJUST
          end

          def unreviewed?
            !adjustment.match(/\d/)
          end

          delegate :amount, to: :item
        end

        CreatePresenter = Class.new(Items::BasePresenter) do
          def previously_budgeted
            item.amount
          end

          def event_type
            EventTypes::SETUP_ITEM_CREATE
          end

          def amount
            0
          end

          def unreviewed?
            updated_amount.zero?
          end
        end
      end
    end
  end
end
