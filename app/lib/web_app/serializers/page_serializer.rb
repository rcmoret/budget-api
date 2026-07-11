# frozen_string_literal: true

module WebApp
  module Serializers
    class PageSerializer < GenericSerializer
      transform_keys :lower_camel

      include Mixins::AccountsNavigation
      include Mixins::AppRoutesConcern
      include Mixins::NotificationsConcern
      include Mixins::PageMetadata
      include Mixins::RedirectSegments
    end
  end
end
