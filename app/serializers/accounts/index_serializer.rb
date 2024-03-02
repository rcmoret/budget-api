module Accounts
  class IndexSerializer < ApplicationSerializer
    attribute :accounts, on_render: :render

    def accounts
      SerializableCollection.new(serializer: ShowSerializer) do
        user_accounts.map do |account|
          {
            account: account,
            balance: balances_by_account_id.find { |struct| struct.account_id == account.id }&.balance.to_i,
          }
        end
      end
    end

    private

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
      __getobj__
    end

    AccountIdWithBalance = Struct.new(:account_id, :balance)
  end
end
