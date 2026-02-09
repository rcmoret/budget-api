module WebApp
  module Budget
    module Interval
      class ShowSerializer < ApplicationSerializer
        attribute :discretionary, on_render: :render
        attribute :items,
          on_render: :render,
          each_serializer: ItemSerializer,
          alias_of: :item_objects
        attribute :data, on_render: :render
        attribute :categories, on_render: :render
        attribute :accounts

        def initialize(user_or_group, interval)
          @user_or_group = user_or_group
          super(interval)
        end

        def data
          DataSerializer.new(interval)
        end

        def discretionary
          DiscretionarySerializer.new(interval)
        end

        def categories
          SerializableCollection.new(serializer: CategorySerializer) do
            ::Budget::Category.belonging_to(user_or_group)
          end
        end

        def item_objects
          interval.items.map(&:decorated).map do |item|
            {
              item:,
              maturity_interval:
                upcoming_maturity_intervals.find(item.category_id),
            }
          end
        end

        def accounts
          SerializableCollection.new(
            serializer: WebApp::DashboardSerializer::LocalAccountSerializer
          ) do
            user_accounts.map do |account|
              {
                account:,
                balance: balances_by_account_id.find do |struct|
                  struct.account_id == account.id
                end&.balance.to_i,
              }
            end
          end
        end

        private

        attr_reader :user_or_group

        def interval
          __getobj__
        end

        def upcoming_maturity_intervals
          @upcoming_maturity_intervals ||=
            ::Budget::UpcomingMaturityIntervalQuery.new(interval:).call
        end

        def user_accounts
          Current.user_profile.accounts.active
        end

        def balances_by_account_id
          @balances_by_account_id ||=
            Transaction::Detail
            .joins(:entry)
            .where(entry: { account: user_accounts })
            .group(:account_id)
            .sum(:amount)
            .map do |id, balance|
              WebApp::DashboardSerializer::AccountIdWithBalance.new(id,
                balance)
            end
        end
      end
    end
  end
end
