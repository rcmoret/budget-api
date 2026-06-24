module Budget
  module Changes
    class Setup
      module Resources
        class CategorySerializer
          include Alba::Resource

          attributes :key,
            :name,
            :slug,
            :icon_class_name,
            :icon_key,
            :is_accrual,
            :is_expense,
            :is_monthly,
            :route

          one :default_amount, resource: WebApp::MonetaryAmountSerializer

          many :events, source: proc { events.map(&:flags) } do
            attributes :eq_prev_budgeted,
              :eq_prev_spent,
              :show_default_suggestion,
              :unreviewed,
              :has_delete_intent,
              :is_valid

            transform_keys :lower_camel
          end

          def route(category)
            Rails
              .application
              .routes
              .url_helpers
              .budget_setup_form_path(
                month: params[:month],
                year: params[:year],
                slug: category.slug
              )
          end

          transform_keys :lower_camel
        end
      end
    end
  end
end
