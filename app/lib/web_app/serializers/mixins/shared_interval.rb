# frozen_string_literal: true

module WebApp
  module Serializers
    module Mixins
      module SharedInterval
        extend ActiveSupport::Concern

        included do
          attributes :total_days

          attribute :days_remaining do |budget_month|
            if budget_month.current?
              [ (last_date.to_date - Time.current.to_date + 1).to_i.abs, 1 ].max
            elsif budget_month.past?
              0
            else
              total_days
            end
          end
        end

        def days_remaining(budget_month)
          if budget_month.current?
            [ (last_date.to_date - Time.current.to_date + 1).to_i.abs, 1 ].max
          elsif budget_month.past?
            0
          else
            total_days(budget_month)
          end
        end

        def total_days(budget_month)
          (budget_month.last_date.to_date - budget_month.first_date.to_date)
            .to_i + 1
        end
      end
    end
  end
end
