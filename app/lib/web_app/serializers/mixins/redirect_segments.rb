# frozen_string_literal: true

module WebApp
  module Serializers
    module Mixins
      module RedirectSegments
        extend ActiveSupport::Concern

        included do
          attribute :redirect_segments do
            Array.wrap(params.fetch(:redirect_segments) { [ "budget" ] })
          end
        end
      end
    end
  end
end
