module Budget
  module Changes
    class Setup
      module Resource
        module Index
          class GroupResource
            include Alba::Resource

            attributes :label, :scopes
            many :categories, resource: CategoryResource

            nested_attribute(:metadata) do
              attribute(:sum) { |object| object.categories.sum(&:sum) }
              attribute(:count) { |object| object.categories.count }
              attribute(:unreviewed) { |object| object.categories.count(&:unreviewed?) }
              attribute(:is_reviewed) { |object| object.categories.count(&:reviewed?) }
              attribute(:is_selected, &:is_selected)

              transform_keys :lower_camel
            end

            transform_keys :lower_camel
          end
        end
      end
    end
  end
end
