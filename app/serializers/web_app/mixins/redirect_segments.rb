# frozen_string_literal: true

module WebApp
  module Mixins
    module RedirectSegments
      extend ActiveSupport::Concern

      included do
        include Alba::Resource

        attribute :redirect_segments do
          Array.wrap(params.fetch(:redirect_segments) { [ "budget" ] })
        end
      end
    end
  end
end
