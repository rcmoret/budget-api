# frozen_string_literal: true

module API
  module Mixins
    module SharedInterval
      def total_days
        (last_date.to_date - first_date.to_date).to_i + 1
      end

      def days_remaining
        if current?
          [ (last_date.to_date - Time.current.to_date + 1).to_i.abs, 1 ].max
        elsif past?
          0
        else
          total_days
        end
      end
    end
  end
end
