# frozen_string_literal: true

module Forms
  module Budget
    class CategoryForm
      include ActiveModel::Model

      def initialize(user, category, params)
        @user = user
        @category = category
        @params = params.to_h
      end

      def save = category.update(formatted_params)

      private

      def formatted_params
        if maturity_interval_data?
          params.merge(maturity_intervals_attributes: maturity_intervals_attributes)
        else
          params
        end
      end

      def maturity_intervals_attributes
        params.delete(:maturity_intervals).filter_map do |attributes|
          handle_maturity_interval(attributes)
        end
      end

      def handle_maturity_interval(attributes)
        interval = ::Budget::Interval.fetch(user, key: attributes.slice("month", "year"))

        return { budget_interval_id: interval.id } unless attributes[:_destroy]

        maturity_interval = ::Budget::CategoryMaturityInterval.find_by(interval: interval, category: category)

        { id: maturity_interval.id, _destroy: true } if maturity_interval.present?
      end

      def maturity_interval_data? = params.key?(:maturity_intervals)

      attr_reader :user, :category, :params
    end
  end
end
