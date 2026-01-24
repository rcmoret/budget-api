module Budget
  module Intervals
    module DateScopes
      extend ActiveSupport::Concern

      included do
        scope :order_asc, -> { order(year: :asc, month: :asc) }
        scope :order_desc, -> { order(year: :desc, month: :desc) }
        scope :on, ->(month:, year:) { where(month: month, year: year) }
        scope :before, lambda { |month:, year:|
          where(year: ...year).or(where(year: year, month: ...month))
        }
        scope :after, lambda { |month:, year:|
          where(year: (year + 1)..).or(where(year: year, month: (month + 1)..))
        }
        scope :on_or_after, lambda { |month:, year:|
          on(year: year, month: month).or(after(month: month, year: year))
        }
        scope :on_or_before, lambda { |month:, year:|
          on(year: year, month: month).or(before(month: month, year: year))
        }
        scope :between_dates, lambda { |range|
          date1 = range.first
          date2 = range.last

          on_or_before(month: date2.month, year: date2.year)
            .on_or_after(month: date1.month, year: date1.year)
        }
      end
    end
  end
end
