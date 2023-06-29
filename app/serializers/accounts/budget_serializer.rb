module Accounts
  class BudgetSerializer < ApplicationSerializer
    attribute :items, on_render: :render
    attributes :month, :year, :days_remaining, :total_days
    attribute :first_date, on_render: proc { |datestring| datestring.strftime("%F") }
    attribute :last_date, on_render: proc { |datestring| datestring.strftime("%F") }
    attribute :is_current, alias_of: :current?

    def total_days
      (last_date.to_date - first_date.to_date).to_i + 1
    end

    def days_remaining
      if current?
        [(last_date.to_date - Time.current.to_date + 1).to_i.abs, 1].max
      elsif past?
        0
      else
        total_days
      end
    end

    def items
      SerializableCollection.new(serializer: BudgetItemSerializer) do
        interval.items.map(&:decorated).map do |item|
          {
            item: item,
            maturity_interval: upcoming_maturity_intervals.find(item.category_id),
          }
        end
      end
    end

    private

    def interval
      __getobj__
    end

    def upcoming_maturity_intervals
      @upcoming_maturity_intervals ||=
        Budget::UpcomingMaturityIntervalQuery.new(interval: interval).call
    end
  end
end
