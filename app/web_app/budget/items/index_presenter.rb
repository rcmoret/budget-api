# frozen_string_literal: true

module WebApp
  module Budget
    module Items
      # The dashboard's data narrowed to a single category's items.
      # Discretionary stays month-wide since it's built from all of the
      # interval's items.
      class IndexPresenter
        def initialize(interval, items:)
          @dashboard = DashboardPresenter.new(interval)
          @items = items
        end

        delegate :budget_month, :discretionary, to: :dashboard

        private

        attr_reader :dashboard, :items
      end
    end
  end
end
