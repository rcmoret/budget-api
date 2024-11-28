module API
  module Accounts
    module Transactions
      class BudgetSerializer < ApplicationSerializer
        include Mixins::SharedInterval

        attribute :items, on_render: :render
        attributes :month, :year, :days_remaining, :total_days
        attribute :first_date, on_render: proc { |timestamp| render_date_time(timestamp) }
        attribute :last_date, on_render: proc { |timestamp| render_date_time(timestamp) }
        attribute :is_current, alias_of: :current?

        def items
          SerializableCollection.new(serializer: BudgetItemSerializer) do
            interval.items.map do |item|
              {
                item: item.decorated,
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
            ::Budget::UpcomingMaturityIntervalQuery.new(interval: interval).call
        end
      end
    end
  end
end
