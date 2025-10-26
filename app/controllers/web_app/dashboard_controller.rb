module WebApp
  class DashboardController < BaseController
    include Mixins::HasBudgetInterval

    def call
      render inertia: "home/index", props: page_props
    end

    private

    def props
      @props ||= {
        dashboard: DashboardSerializer.new(interval),
        data: API::Budget::Interval::DataSerializer.new(interval),
      }.transform_values(&:render)
    end

    def namespace = "dashboard"
  end
end
