module User
  class AccountsSerializer < ApplicationSerializer
    attribute :accounts, on_render: :render

    def accounts
      SerializableCollection.new(serializer: AccountSerializer) do
        Account.belonging_to(user).map do |account|
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
        .belonging_to(user)
        .group(:account_id)
        .sum(:amount)
        .map { |id, balance| AccountIdWithBalance.new(id, balance) }
    end

    def user
      __getobj__
    end

    AccountIdWithBalance = Struct.new(:account_id, :balance)
  end
end
