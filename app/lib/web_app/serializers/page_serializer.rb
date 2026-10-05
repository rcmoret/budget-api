# frozen_string_literal: true

module WebApp
  module Serializers
    class PageSerializer < ::Serializers::GenericSerializer
      transform_keys :lower_camel

      include Mixins::AccountsNavigation
      include Mixins::AppRoutesConcern
      include Mixins::NotificationsConcern
      include Mixins::PageMetadata

      attributes :redirect_segments, :theme_preference
    end
  end
end
