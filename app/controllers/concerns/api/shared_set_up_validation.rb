module API
  module SharedSetUpValidation
    extend ActiveSupport::Concern

    included do
      before_action :check_set_up_status!
    end

    private

    def check_set_up_status!
      return unless interval.set_up?

      render json: { budgetInterval: "has been set up" }, status: :bad_request
    end
  end
end
