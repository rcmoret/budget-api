# frozen_string_literal: true

module WebApp
  module Pages
    class PageSerializer < ::Serializers::GenericSerializer
      transform_keys :lower_camel

      include Concerns::AccountsNavigation
      include Concerns::AppRoutesConcern
      include Concerns::NotificationsConcern
      include Concerns::PageMetadata

      attributes :redirect_segments, :theme_preference
    end
  end
end
