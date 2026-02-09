# frozen_string_literal: true

module WebApp
  module Budget
    module Setup
      module Mixins
        module UserChangesScope
          def change_set_scope
            ::Budget::Changes::Setup
              .belonging_to(current_user_profile)
              .where(interval:)
          end
        end

        # This concern adds methods to fetch and validate budget intervals by
        #   month/year params.
        # Includes all of the behavior of `WebApp::Mixins::HasBudgetInterval`
        #   Plus a check to ensure the interval was not already set up
        module HasBudgetInterval
          extend ActiveSupport::Concern
          include WebApp::Mixins::HasBudgetInterval

          included do
            before_action -> { redirect_to(budget_path) },
              if: -> { interval.set_up? }
          end
        end

        module HasChangeSet
          extend ActiveSupport::Concern
          include UserChangesScope

          included do
            before_action -> { redirect_to budget_setup_form_path },
              if: -> { change_set.nil? }
          end

          def change_set
            @change_set ||= change_set_scope.sole
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
            before_action -> { redirect_to budget_setup_form_path },
              if: -> { budget_category_record.nil? }
          end

          def budget_category_record
            @budget_category_record ||=
              ::Budget::Category.fetch(
                current_user_profile,
                slug: category_slug
              )
          end
        end
      end
    end
  end
end
