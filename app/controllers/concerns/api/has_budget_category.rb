module API
  module HasBudgetCategory
    extend ActiveSupport::Concern

    included do
      before_action :render_category_not_found, unless: :category_found?
    end

    private

    def render_category_not_found
      render json: { category: "not found by key: #{category_key}" }, status: :not_found
    end

    def category_found?
      budget_category.present?
    end

    def budget_category
      @budget_category ||= ::Budget::Category.fetch(user: api_user, key: category_key)
    end

    def category_key
      params.fetch(:category_key)
    end
  end
end
