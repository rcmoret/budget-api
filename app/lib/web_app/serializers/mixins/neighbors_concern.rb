# frozen_string_literal: true

module WebApp
  module Serializers
    module Mixins
      module NeighborsConcern
        extend ActiveSupport::Concern

        included do
          include Alba::Resource
          include Rails.application.routes.url_helpers

          attributes :month_name
          attributes :month,
            :year,
            :href

          def href(...)
            raise NotImplementedError
          end

          def month_name(budget_month)
            Time
              .new(budget_month.year, budget_month.month, 15)
              .strftime("%B %Y")
          end
        end
      end
    end
  end
end
