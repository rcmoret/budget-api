module WebApp
  class DashboardController < BaseController
    include Mixins::HasBudgetInterval

    def call
      render inertia: "home/index", props: page_props
    end

    private

    def props
      @props ||= {
        dashboard: DashboardSerializer.new(interval).render,
        data: API::Budget::Interval::DataSerializer.new(interval).render,
      }
    end

    def namespace = "dashboard"
  end
end
