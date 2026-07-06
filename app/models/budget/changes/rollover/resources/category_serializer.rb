module Budget
  module Changes
    class Rollover
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
            attributes :rollover_all,
              :rollover_none,
              :show_default_suggestion,
              :unreviewed,
              :is_valid

            transform_keys :lower_camel
          end

          def route(category)
            Rails
              .application
              .routes
              .url_helpers
              .budget_rollover_form_path(
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
