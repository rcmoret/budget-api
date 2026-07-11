# frozen_string_literal: true

module WebApp
  module Serializers
    module Mixins
      module NotificationsConcern
        extend ActiveSupport::Concern

        included do
          attribute :notifications, &:flash
        end
      end
    end
  end
end
