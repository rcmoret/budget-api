# frozen_string_literal: true

module WebApp
  module Budget
    module Rollover
      module Mixins
        module UserChangesScope
          extend ActiveSupport::Concern

          included do
            before_action :redirect_to_budget_dashboard!,
              if: -> { interval.closed_out? }
            before_action :find_change_set
          end

          def change_set_scope
            ::Budget::Changes::Rollover
              .belonging_to(current_user_profile)
              .where(interval:)
          end

          private

          def find_change_set
            change_set
          rescue ActiveRecord::SoleRecordExceeded, ActiveRecord::RecordNotFound
            flash[:alert] = "There was an error with the finalize form"
            redirect_to budget_dashboard_path(
              month: interval.month,
              year: interval.year
            )
          end

          def change_set
            @change_set ||= change_set_scope.sole
          end

          def redirect_to_budget_dashboard!
            flash[:warning] = "Budget month is closed out"
            redirect_to budget_dashboard_path(
              month: interval.month,
              year: interval.year
            )
          end
        end

        module RequiresChangeSet
          extend ActiveSupport::Concern
          include UserChangesScope

          included do
            before_action :redirect_to_form!, if: -> { change_set.nil? }
          end

          private

          def redirect_to_form!
            redirect_to budget_rollover_form_path(month, year)
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
