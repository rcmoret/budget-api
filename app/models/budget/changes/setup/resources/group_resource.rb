module Budget
  module Changes
    class Setup
      module Resources
        class GroupResource
          include Alba::Resource

          attributes :label, :scopes
          attribute(:name) { |object| object.label.singularize }
          attribute :categories do |object|
            object.categories.map do |category|
              category
                .to_h
                .merge(events: category.events.map(&:flags))
                .deep_transform_keys { |k| k.to_s.camelize(:lower) }
            end
          end

          nested_attribute(:metadata) do
            attribute(:sum) { |object| object.categories.sum(&:sum) }
            attribute(:count) { |object| object.categories.count }
            attribute(:unreviewed) { |object| object.categories.count(&:unreviewed?) }
            attribute(:is_reviewed) { |object| object.categories.count(&:reviewed?) }

            attributes :is_selected

            transform_keys :lower_camel
          end

          transform_keys :lower_camel
        end
      end
    end
  end
end
