module Accounts
  class TransactionsIndexSerializer < User::AccountSerializer
    attributes :key, :name, :slug, :priority, :balance, :balance_prior_to
    attribute :transactions, on_render: :render
    attribute :is_cash_flow, alias_of: :cash_flow?
    attribute :is_archived, alias_of: :archived?
    attribute :archived_at, on_render: proc { |datetime| datetime&.strftime("%F") }
    attribute :items, on_render: :render

    def initialize(account:, interval:)
      super(account: account)
      @interval = interval
    end

    def transactions
      super.call(interval)
    end

    def balance_prior_to
      super.call(interval)
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

    attr_reader :interval

    def upcoming_maturity_intervals
      @upcoming_maturity_intervals ||=
        Budget::UpcomingMaturityIntervalQuery.new(interval: interval).call
    end
  end
end
