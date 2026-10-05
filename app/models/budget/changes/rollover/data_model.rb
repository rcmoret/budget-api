module Budget
  module Changes
    class Rollover
      class DataModel
        include DataModelConcern

        GROUPS = %i[accruals revenues expenses].freeze

        # Simple and Complex results share the item shape but only Complex
        # serializes category level totals, so they're derived from the items.
        CategoryStruct = Data.define(:data) do
          def key = data["key"]
          def name = data["name"]
          def slug = data["slug"]
          def items = data.fetch("items", [])
          def target_events = data.fetch("target_events", [])
          def accrual? = !!data["is_accrual"]
          def expense? = !!data["is_expense"]

          def group
            return :accruals if accrual?

            expense? ? :expenses : :revenues
          end

          def unapplied_amount
            Money.from_cents(
              items.sum { |item| item.dig("unapplied_amount", "cents").to_i }
            )
          end

          def unreviewed? = items.any? { |item| !item["is_reviewed"] }
          def reviewed? = !unreviewed?
          def to_h = data
        end

        def initialize(change)
          @change = change
          @data = (change.events_data || {}).deep_stringify_keys
          @categories =
            @data
            .fetch("categories", [])
            .map { |category_data| CategoryStruct.new(data: category_data) }
            .sort_by { |cat| [ GROUPS.index(cat.group), cat.name ] }
        end

        def all_reviewed?
          categories.any? && categories.all?(&:reviewed?)
        end

        def submittable? = all_reviewed? && unapplied_target_valid?

        # The net of what isn't rolled over, across revenues and expenses.
        def unapplied_total
          categories.sum(Money.from_cents(0), &:unapplied_amount)
        end

        def unapplied_target_event = @data["unapplied_target_event"]

        # Checked on every read: editing items after a target was picked can
        # flip the total's sign, which makes the stored target the wrong kind.
        def unapplied_target_valid?
          total = unapplied_total
          return true if total.zero?
          return false if unapplied_target_event.nil?

          unapplied_target_event["is_expense"] == total.negative?
        end
      end
    end
  end
end
