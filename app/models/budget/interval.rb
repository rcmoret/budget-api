module Budget
  class Interval < ApplicationRecord
    include BelongsToUserGroup
    include Fetchable
    include Intervals::DateScopes

    has_many :items, foreign_key: :budget_interval_id, inverse_of: :interval,
      dependent: :restrict_with_exception
    has_many :change_sets,
      class_name: "ChangeSet",
      dependent: :destroy,
      inverse_of: :interval,
      foreign_key: :budget_change_set_id
    has_many :maturity_intervals,
      class_name: "CategoryMaturityInterval",
      dependent: :destroy,
      inverse_of: :interval,
      foreign_key: :budget_interval_id

    validates :month, presence: true, inclusion: (1..12)
    validates :year, presence: true, inclusion: (2000..2099)
    validates :month, uniqueness: { scope: %i[year user_group_id] }
    validates :effective_start,
      comparison: { less_than_or_equal_to: proc { Time.current } },
      allow_nil: true

    scope :ordered, -> { order_asc }
    scope :unclosed, -> { where(close_out_completed_at: nil) }
    scope :started, -> { where.not(effective_start: nil) }

    class << self
      def for(date_hash)
        find_or_create_by(date_hash)
      end
      alias by_key for

      alias prior_to before

      def current
        started.order(effective_start: :desc).take.presence ||
          determine_current
      end

      def today
        Date.current.to_date
      end

      private

      def determine_current
        potential_interval = self.for(month: today.month, year: today.year)
        return potential_interval.next if potential_interval.last_date < today
        return potential_interval.prev if potential_interval.first_date > today

        potential_interval
      end
    end

    def set_up?
      set_up_completed_at.present?
    end

    def first_date
      return start_date if start_date.present?

      DateTime.new(year, month, 1).then do |first|
        first -= 1.day while weekend_or_holiday?(first)
        first
      end
    end

    def last_date
      return end_date if end_date.present?

      next_month.first_date - 1.day
    end

    def prev
      if month > 1
        self.class.belonging_to(user_group).for(month: (month - 1), year:)
      else
        self.class.belonging_to(user_group).for(month: 12, year: (year - 1))
      end
    end

    def next_month
      if month < 12
        self.class.belonging_to(user_group).for(month: (month + 1), year:)
      else
        self.class.belonging_to(user_group).for(month: 1, year: (year + 1))
      end
    end
    alias next next_month

    def date_range
      first_date..last_date
    end

    def closed_out?
      close_out_completed_at.present?
    end

    def current?
      self.class.belonging_to(user_group).current == self
    end

    def started?
      effective_start.present?
    end

    def future?
      return false if started?

      first_date.to_date > today
    end

    def past?
      return true if self.next.started?

      last_date.to_date < today
    end

    private

    def weekend_or_holiday?(date)
      date.saturday? || date.sunday? || holiday?(date)
    end

    def holiday?(date)
      # always adjust for New Year's Day
      return true if date.month == 1 && date.day == 1
      # adjust for labor day if it falls on the first
      return true if date.month == 9 && date.day == 1 && date.monday?

      false
    end

    def today
      self.class.today
    end
  end
end
