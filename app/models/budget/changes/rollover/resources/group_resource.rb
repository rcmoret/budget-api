module Budget
  module Changes
    class Rollover
      module Resources
        class GroupResource
          include Alba::Resource

          attributes :label, :scopes
          attribute(:name) { |object| object.label.singularize }
          attribute(:key) { |object| object.scopes.join("-") }
          many :categories, resource: CategorySerializer

          nested_attribute(:metadata) do
            one :sum,
              resource: WebApp::MonetaryAmountSerializer,
              source: proc { categories.sum(&:sum) }
            attribute(:count) { |object| object.categories.count }
            attribute(:unreviewed) do |object|
              object.categories.count(&:unreviewed?)
            end
            attribute(:is_reviewed) do |object|
              object.categories.count(&:reviewed?)
            end

            attributes :is_selected

            transform_keys :lower_camel
          end

          transform_keys :lower_camel
        end
      end
    end
  end
end
