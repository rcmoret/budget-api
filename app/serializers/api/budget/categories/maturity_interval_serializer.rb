module API
  module Budget
    module Categories
      class MaturityIntervalSerializer < ApplicationSerializer
        attribute :key
        attribute :maturity_intervals

        delegate :key, to: :category

        def maturity_intervals
          [{ month: month, year: year }]
        end
      end
    end
  end
end
