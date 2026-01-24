module Budget
  module Changes
    class Setup
      module Resources
        class IndexResource
          include Alba::Resource

          root_key!

          attribute(:budget_category) do |object|
            object.selected_category.to_h.deep_transform_keys do |k|
              k.to_s.camelize(:lower)
            end
          end

          nested :metadata do
            attributes :budget_total,
                       :is_submittable,
                       :next_category_slug,
                       :next_unreviewed_category_slug,
                       :previous_category_slug,
                       :previous_unreviewed_category_slug,
                       :month,
                       :year
            attribute(:previous_month) { |object| object.base_interval.month }
            attribute(:previous_year) { |object| object.base_interval.year }

            transform_keys :lower_camel
          end

          nested_attribute :groups do
            one(:revenues, resource: GroupResource, source: proc { revenues })
            one(:monthly_expenses, resource: GroupResource, source: proc { monthly_expenses })
            one(:day_to_day_expenses, resource: GroupResource, source: proc { day_to_day_expenses })

            transform_keys :lower_camel
          end

          transform_keys :lower_camel
        end
      end
    end
  end
end
