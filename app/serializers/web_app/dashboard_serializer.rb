module WebApp
  class DashboardSerializer < ApplicationSerializer
    LocalAccountSerializer = Class.new(ApplicationSerializer) do
      attributes :name, :slug, :balance

      def initialize(args)
        super(args[:account])
        @balance = args.fetch(:balance) { account.balance }
      end

      private

      attr_reader :balance
    end
    private_constant :LocalAccountSerializer

    include Mixins::AvailableCash

    attributes :available_cash,
               :spent,
               :total_budgeted,
               :total_remaining
    attribute :accounts, on_render: :render

    def initialize
      interval = ::Budget::Interval.belonging_to(user_profile).current
      super(interval)
    end

    def total_budgeted
      {
        monthly_expenses: monthly_expenses.sum(&:amount),
        day_to_day_expenses: day_to_day_expenses.sum(&:amount),
        revenues: revenues.sum(&:amount),
      }
    end

    def total_remaining
      {
        monthly_expenses: monthly_expenses.sum(&:remaining),
        day_to_day_expenses: day_to_day_expenses.sum(&:remaining),
        revenues: revenues.sum(&:remaining),
      }
    end

    def spent
      {
        monthly_expenses: monthly_expenses.sum(&:spent),
        day_to_day_expenses: day_to_day_expenses.sum(&:spent),
        revenues: revenues.sum(&:spent),
      }
    end

    def accounts
      SerializableCollection.new(serializer: LocalAccountSerializer) do
        user_accounts.map do |account|
          {
            account: account,
            balance: balances_by_account_id.find { |struct| struct.account_id == account.id }&.balance.to_i,
          }
        end
      end
    end

    private

    def items
      @items ||= interval.items
    end

    def interval = __getobj__

    def user_profile = Current.user_profile

    def expenses
      @expenses ||= items.expenses.map(&:decorated)
    end

    def revenues
      @revenues ||= items.revenues.map(&:decorated)
    end

    def monthly_expenses
      expenses.select(&:monthly?)
    end

    def day_to_day_expenses
      expenses.reject(&:monthly?)
    end

    def balances_by_account_id
      @balances_by_account_id ||=
        Transaction::Detail
        .joins(:entry)
        .where(entry: { account: user_accounts })
        .group(:account_id)
        .sum(:amount)
        .map { |id, balance| AccountIdWithBalance.new(id, balance) }
    end

    def user_accounts
      user_profile.accounts.active
    end

    AccountIdWithBalance = Struct.new(:account_id, :balance)
  end
end
