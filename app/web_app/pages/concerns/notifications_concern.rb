# frozen_string_literal: true

module WebApp
  module Pages
    module Concerns
      module NotificationsConcern
        extend ActiveSupport::Concern

        included do
          attribute :notifications, &:flash
        end
      end
    end
  end
end
