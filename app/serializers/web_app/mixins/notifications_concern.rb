module WebApp
  module Mixins
    module NotificationsConcern
      extend ActiveSupport::Concern

      included do
        nested_attribute :notifications do
          attributes :alerts,
            :info,
            :notices,
            :warnings

          transform_keys :lower_camel
        end
      end
    end
  end
end
