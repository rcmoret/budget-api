module Serializers
  module BudgetPlanning
    module Rollover
      class DataModel
        include Budget::Changes::DataModelConcern
        # include Alba::Resource

        def initialize(change)
          @change = change
          @categories =
            change.events_data.fetch("categories").map do |category_data|
              category_struct(category_data)
            end.sort!
        end
      end
    end
  end
end
