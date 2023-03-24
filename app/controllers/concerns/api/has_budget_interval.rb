module API
  module HasBudgetInterval
    extend ActiveSupport::Concern

    included do
      before_action :render_interval_not_found, unless: :valid_interval_found?
    end

    private

    def render_interval_not_found
      render json: { interval: error_message }, status: :not_found
    end

    def interval
      @interval ||= if month.nil? || year.nil?
                      Budget::Interval.belonging_to(api_user).current
                    else
                      Budget::Interval.fetch(user: api_user, key: { month: month, year: year })
                    end
    end

    def month
      params[:month]
    end

    def year
      params[:year]
    end

    def error_message
      "not found by month: #{month.inspect} and year: #{year.inspect}"
    end

    def valid_interval_found?
      interval.present? && interval.persisted? && interval.valid?
    end
  end
end
