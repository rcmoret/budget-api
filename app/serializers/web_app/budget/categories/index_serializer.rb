# frozen_string_literal: true

module WebApp
  module Budget
    module Categories
      class IndexSerializer < PageSerializer
        many :categories, resource: CategoryResource

        transform_keys :lower_camel
      end
    end
  end
end
