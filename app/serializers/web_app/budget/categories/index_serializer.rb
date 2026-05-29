# frozen_string_literal: true

module WebApp
  module Budget
    module Categories
      class IndexSerializer
        include Alba::Resource

        many :categories, resource: CategoryResource

        one :metadata, resource: MetadataSerializer

        nested_attribute :notifications do
          attributes :alerts,
            :info,
            :notices,
            :warnings
        end

        transform_keys :lower_camel
      end
    end
  end
end
