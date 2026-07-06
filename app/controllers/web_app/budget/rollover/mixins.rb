# frozen_string_literal: true

module WebApp
  module Budget
    module Rollover
      module Mixins
        module UserChangesScope
          def change_set_scope
            ::Budget::Changes::Rollover
              .belonging_to(current_user_profile)
              .where(interval:)
          end
        end

        module HasSlugParams
          def category_slug
            params.permit(:month, :year, :slug)[:slug].presence
          end
        end

        module HasBudgetCategoryRecord
          extend ActiveSupport::Concern

          included do
            before_action :handle_budget_category_not_found!,
              if: :missing_budget_category?
          end

          def budget_category_record
            @budget_category_record ||=
              ::Budget::Category.fetch(
                current_user_profile,
                slug: category_slug
              )
          end

          private

          def missing_budget_category?
            budget_category_record.nil?
          end

          def handle_budget_category_not_found!
            flash[:warning] = "category not found by slug: `#{category_slug}`"

            redirect_to budget_rollover_form_path(month, year)
          end
        end
      end
    end
  end
end
