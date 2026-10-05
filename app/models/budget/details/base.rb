# frozen_string_literal: true

module Budget
  module Details
    class Base < ApplicationRecord
      include ItemConcern

      self.table_name = :budget_details
      self.primary_key = :id

      # monetize :budgeted_cents,
      #   :currently_budgeted_cents,
      #   :difference_cents,
      #   :previously_budgeted_cents,
      #   :transaction_detail_total_cents

      scope :fixed, -> { where(type: "Budget::Details::Fixed") } do
        def reviewable
          where(
            arel_table[:transaction_detail_count]
            .eq(0)
            .and(arel_table[:budgeted].not_eq(0))
          )
        end
      end

      scope :variable_expense, lambda {
        where(type: "Budget::Details::VariableExpense")
      } do
        def reviewable
          where(difference: ...0)
        end
      end

      scope :variable_revenue, lambda {
        where(type: "Budget::Details::VariableRevenue")
      } do
        def reviewable
          where(difference: 1..)
        end
      end

      scope :reviewable, lambda {
        fixed
          .reviewable
          .or(variable_expense.reviewable)
          .or(variable_revenue.reviewable)
      }

      def object_prefix
        super("Budget::Item")
      end

      def remaining
        raise NotImplementedError
      end

      def reviewable?
        raise NotImplementedError
      end

      def budget_impact
        raise NotImplementedError
      end

      def difference
        amount - transaction_detail_total
      end

      def amount
        previously_budgeted + currently_budgeted
      end

      def deleted? = deleted_at.present?

      def deletable?
        transaction_detail_count.zero?
      end

      def previously_budgeted_percentage
        return 0 if previously_budgeted.zero?
        return 100 if currently_budgeted.zero?

        100 - currently_budgeted_percentage
      end

      def currently_budgeted_percentage
        return 0 if currently_budgeted.zero? || amount.zero?
        return 100 if previously_budgeted.zero?

        ((100 * currently_budgeted) / amount).clamp(1, 99)
      end

      def mature?
        return false unless accrual?

        [ maturity_month, maturity_year ] == [ month, year ]
      end

      def maturing!
        Budget::CategoryMaturityInterval.create(
          category:,
          interval:
        )
      end

      def upcoming_maturity_date
        return if mature? || maturity_month.nil? || maturity_year.nil?

        Date.new(maturity_year, maturity_month)
      end
    end
  end
end
