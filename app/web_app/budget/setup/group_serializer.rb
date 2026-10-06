module WebApp
  module Budget
    module Setup
      class GroupSerializer
        include Alba::Resource

        attributes :label, :scopes
        attribute(:name) { |object| object.label.singularize }
        attribute(:key) { |object| object.scopes.join("-") }
        many :categories, resource: CategorySerializer
        # attribute :categories do |object|
        #   object.categories.map do |category|
        #     category
        #       .to_h
        #       .merge(events: category.events.map(&:flags))
        #       .deep_transform_keys { |k| k.to_s.camelize(:lower) }
        #   end
        # end

        nested_attribute(:metadata) do
          attributes sum: :money
          attribute(:count) { |object| object.categories.count }
          attribute(:unreviewed) do |object|
            object.categories.count(&:unreviewed?)
          end
          attribute(:is_reviewed) do |object|
            object.categories.count(&:reviewed?)
          end

          attributes :is_selected

          transform_keys :lower_camel

          def sum(object) = object.categories.sum(&:sum)
        end

        transform_keys :lower_camel
      end
    end
  end
end
