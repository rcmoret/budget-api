# frozen_string_literal: true

module WebApp
  module Budget
    module Items
      class IndexController < BaseController
        include Mixins::HasBudgetInterval
        include Mixins::PageController

        define_route_segment :budget
        use_template "budget/items"
        serialize_with IndexSerializer

        before_action :redirect_if_no_items!,
          if: -> { category.nil? || items.none? }

        subject do
          presenter
        end

        private

        def category
          @category ||=
            ::Budget::Category.fetch(
              current_user_profile,
              slug: category_slug
            )
        end

        def items
          @items ||=
            interval
            .detailed_items
            .where(category:)
            .active
            .includes(transaction_details: { entry: :account })
            .order(name: :asc)
            .to_a
        end

        def presenter
          @presenter ||= IndexPresenter.new(interval, items:)
        end

        def category_slug
          params[:category_slug]
        end

        def redirect_if_no_items!
          flash[:warning] = "No budget items found for `#{category_slug}`"

          redirect_to budget_dashboard_path(
            month: interval.month,
            year: interval.year
          )
        end

        def serializer_context
          {
            budget_month: BudgetMonthPresenter.new(interval),
            category_slug:,
            month:,
            year:,
          }
        end

        def route_segments
          super(interval.month, interval.year, "items", category_slug)
        end
      end
    end
  end
end
