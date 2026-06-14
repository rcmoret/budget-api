# frozen_string_literal: true

module Budget
  module Details
    class Base < ApplicationRecord
      include HasKeyIdentifier

      self.table_name = :budget_details

      def object_prefix
        super("Budget::Item")
      end

      scope :variable, -> { where(monthly: false) }
      scope :fixed, -> { where(monthly: true) }
      scope :revenues, -> { where(expense: false) }
      scope :expenses, -> { where(expense: true) }

      belongs_to :interval,
        class_name: "Interval",
        foreign_key: :budget_interval_id,
        inverse_of: :items

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
        transaction_detail_count.positive?
      end

      def previously_budgeted_percentage
        return 0 if previously_budgeted.zero?
        return 100 if currently_budgeted.zero?

        100 - currently_budgeted_percentage
      end

      def currently_budgeted_percentage
        return 0 if currently_budgeted.zero?
        return 100 if previously_budgeted.zero?

        ((100 * currently_budgeted) / amount).clamp(1, 99)
      end

      def mature?
        return false unless accrual?

        [ maturity_month, maturity_year ] == [ month, year ]
      end

      def upcoming_maturity_date
        return if mature? || maturity_month.nil? || maturity_year.nil?

        Date.new(maturity_year, maturity_month)
      end
    end
  end
end
