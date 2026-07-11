# frozen_string_literal: true

module WebApp
  class SubjectSerializer
    include Alba::Resource
    meta nil
    transform_keys :lower_camel, root: true
  end
end
