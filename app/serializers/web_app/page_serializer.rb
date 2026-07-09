# frozen_string_literal: true

module WebApp
  class PageSerializer
    include Alba::Resource
    include Mixins::AccountsNavigationConcern
    include Mixins::AppRoutesConcern
    include Mixins::NotificationsConcern
    include Mixins::PageMetadata
    include Mixins::RedirectSegments
  end
end
