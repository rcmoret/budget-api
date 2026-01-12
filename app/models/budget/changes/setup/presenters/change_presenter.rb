module Budget
  module Changes
    class Setup
      module Presenters
        class ChangePresenter
          def initialize(interval:, budget_items: [], category_scope: [])
            @interval = interval
            @category_scope = category_scope
            @budget_items = budget_items
          end

          attr_reader :interval, :category_scope, :budget_items

          def categories
            category_scope.to_a.map do |category|
              catergory_presenter(category)
            end
          end

          private

          def catergory_presenter(category)
            CategoryPresenter.new(
              category,
              interval: interval,
              keys: keys_for(category)
            )
          end

          def keys_for(category)
            budget_items.filter_map { |item| item.key if item.budget_category_id == category.id }
          end
        end
      end
    end
  end
end
