# frozen_string_literal: true

module WebApp
  class GenericSerializer
    include Alba::Resource

    transform_keys :lower_camel
  end
end
