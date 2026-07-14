# frozen_string_literal: true

module WebApp
  class SubjectSerializer
    include Alba::Resource
    include Rails.application.routes.url_helpers
    meta nil
    transform_keys :lower_camel, root: true
  end
end
