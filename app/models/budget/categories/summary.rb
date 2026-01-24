module Budget
  module Categories
    class Summary < ApplicationRecord
      include Intervals::DateScopes

      belongs_to :category,
                 class_name: "Budget::Category",
                 inverse_of: :summaries,
                 foreign_key: :budget_category_id

      def self.most_recent(limit = nil)
        if limit.nil?
          order_desc.first
        else
          order_desc.limit(limit.to_i)
        end
      end

      def <=>(other)
        if year == other.year
          month <=> other.month
        else
          year <=> other.year
        end
      end

      def budgeted
        previously_budgeted + currently_budgeted
      end

      def as_resource
        SummaryResource.new(self)
      end
    end
  end
end
