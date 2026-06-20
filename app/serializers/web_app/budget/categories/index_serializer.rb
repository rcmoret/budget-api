# frozen_string_literal: true

module WebApp
  module Budget
    module Categories
      class IndexSerializer
        include Alba::Resource
        include Mixins::NotificationsConcern

        many :categories, resource: CategoryResource
        one :metadata, resource: MetadataSerializer

        transform_keys :lower_camel
      end
    end
  end
end
