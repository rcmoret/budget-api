module WebApp
  class HomeController < BaseController
    def call
      render inertia: "home/index", props: page_props
    end

    private

    def props = {}

    def namespace = "home"
  end
end
