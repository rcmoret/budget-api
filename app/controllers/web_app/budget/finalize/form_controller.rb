# frozen_string_literal: true

module WebApp
  module Budget
    module Finalize
      class FormController < BaseController
        include Mixins::HasBudgetInterval

        def call
          render inertia: "budget/finalize/index", props: page_props
        end

        private

        def props = serializer.render

        def serializer
          API::Budget::Interval::Finalize::CategoriesSerializer.new(interval)
        end

        def metadata
          {
            namespace: "budget",
            page: {
              name: "budget/finalize",
              month: month,
              year: year,
            },
          }
        end
      end
    end
  end
end
