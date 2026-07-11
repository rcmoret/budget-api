# frozen_string_literal: true

module WebApp
  module Serializers
    class SubjectSerializer
      include Alba::Resource
      meta nil
      transform_keys :lower_camel, root: true
    end
  end
end
