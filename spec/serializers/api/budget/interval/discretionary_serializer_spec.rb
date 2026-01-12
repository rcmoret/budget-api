require "rails_helper"

RSpec.describe API::Budget::Interval::DiscretionarySerializer do
  shared_context "with a user and an interval" do
    let(:user) { create(:user) }
    let(:interval) { create(:budget_interval, user_group: user.group) }
  end

  shared_context "when no details are present within the date range" do
    include_context "with a user and an interval"
  end

  shared_context "when a detail is present within the date range" do
    let(:user) { create(:user) }
    let(:interval) { create(:budget_interval, user_group: user.group) }
    let(:transaction_entry) do
      create(
        :transaction_entry,
        account: create(:account, user_group: user.group),
        description: Faker::Music::GratefulDead.song,
        clearance_date: interval.date_range.to_a.sample,
        details_attributes: [
          {
            key: KeyGenerator.call,
            amount: rand(-100_00..100_00),
            budget_item_id: nil,
          },
        ],
      )
    end
    let(:transaction_detail) { transaction_entry.details.take }
  end

  shared_context "with a stubbed out detail serializer" do
    let(:detail_serializer) do
      instance_double(API::Budget::Interval::TransactionDetailSerializer)
    end

    before do
      allow(API::Budget::Interval::TransactionDetailSerializer)
        .to receive(:new)
        .with(transaction_detail)
        .and_return(detail_serializer)
    end
  end

  shared_context "when a detail is present within the date range" do
    let(:user) { create(:user) }
    let(:interval) { create(:budget_interval, user_group: user.group) }
    let(:transaction_entry) do
      create(
        :transaction_entry,
        account: create(:account, user_group: user.group),
        description: Faker::Music::GratefulDead.song,
        clearance_date: interval.date_range.to_a.sample,
        details_attributes: [
          {
            key: KeyGenerator.call,
            amount: rand(-100_00..100_00),
            budget_item_id: nil,
          },
        ],
      )
    end
    let(:transaction_detail) { transaction_entry.details.take }
  end

  shared_context "with a stubbed out detail serializer" do
    let(:detail_serializer) do
      instance_double(API::Budget::Interval::TransactionDetailSerializer)
    end

    before do
      allow(API::Budget::Interval::TransactionDetailSerializer)
        .to receive(:new)
        .with(transaction_detail)
        .and_return(detail_serializer)
    end
  end

  shared_context "when there is a pending details and the interval is current" do
    let(:user) { create(:user) }
    let(:interval) { create(:budget_interval, user_group: user.group) }

    let!(:transaction_entry) do
      create(
        :transaction_entry,
        account: create(:account, user_group: user.group),
        description: Faker::Music::GratefulDead.song,
        clearance_date: nil,
        details_attributes: [
          {
            key: KeyGenerator.call,
            amount: rand(-100_00..100_00),
            budget_item_id: nil,
          },
        ],
      )
    end
    let(:transaction_detail) { transaction_entry.details.take }

    before { travel_to(interval.date_range.to_a.sample) }
  end

  shared_context "when there is a pending details and the interval is not current" do
    let(:user) { create(:user) }
    let(:interval) { create(:budget_interval, :past, user_group: user.group) }
    let!(:transaction_entry) do
      create(
        :transaction_entry,
        account: create(:account, user_group: user.group),
        description: Faker::Music::GratefulDead.song,
        clearance_date: nil,
        details_attributes: [
          {
            key: KeyGenerator.call,
            amount: rand(-100_00..100_00),
            budget_item_id: nil,
          },
        ],
      )
    end
    let(:transaction_detail) { transaction_entry.details.take }
  end

  shared_context "when there is a budget exclusion within the date range" do
    let(:user) { create(:user) }
    let(:interval) { create(:budget_interval, user_group: user.group) }
    let(:transaction_entry) do
      create(
        :transaction_entry,
        account: create(:account, user_group: user.group),
        description: Faker::Music::GratefulDead.song,
        clearance_date: interval.date_range.to_a.sample,
        budget_excludion: true,
        details_attributes: [
          {
            key: KeyGenerator.call,
            amount: rand(-100_00..100_00),
            budget_item_id: nil,
          },
        ],
      )
    end
    let(:transaction_detail) { transaction_entry.details.take }
  end

  shared_context "when there is a transfer within the date range" do
    let(:user) { create(:user) }
    let(:account) { create(:account, user_group: user.group) }
    let(:savings_account) { create(:savings_account, user_group: user.group) }
    let(:interval) { create(:budget_interval, user_group: user.group) }

    before { travel_to(interval.date_range.to_a.sample) }

    before do
      Forms::TransferForm.new(
        user: user,
        params: {
          from_account_key: account.key,
          to_account_key: savings_account.key,
          amount: rand(-50_00..50_00),
        }
      ).call
    end
  end

  describe "#transaction_details" do
    subject { described_class.new(interval) }

    before do
      other_group = create(:user_group)
      other_group_account = create(:account, user_group: other_group)
      create(
        :transaction_entry,
        account: other_group_account,
        description: Faker::Music::GratefulDead.song,
        clearance_date: interval.date_range.to_a.sample,
        details_attributes: [
          {
            key: KeyGenerator.call,
            amount: rand(-100_00..100_00),
            budget_item_id: nil,
          },
        ],
      )
    end

    context "when a detail is present within the date range" do
      include_context "when a detail is present within the date range"
      include_context "with a stubbed out detail serializer"

      it "passes the transaction detail to the detail serializer" do
        expect(subject.transaction_details).to eq([detail_serializer])
      end
    end

    context "when no details are present within the date range" do
      include_context "when no details are present within the date range"

      it "does not return any detail attributes" do
        expect(subject.transaction_details).to be_empty
      end
    end

    context "when there is a pending details and the interval is current" do
      include_context "when there is a pending details and the interval is current"
      include_context "with a stubbed out detail serializer"

      it "returns the detail(s) attributes" do
        expect(subject.transaction_details).to eq([detail_serializer])
      end
    end

    context "when there is a pending details and the interval is not current" do
      include_context "when there is a pending details and the interval is not current"

      it "does not return any detail attributes" do
        expect(subject.transaction_details).to be_empty
      end
    end

    context "when there is a budget exclusion within the date range" do
      include_context "when there is a budget exclusion within the date range"

      it "does not return any detail attributes" do
        expect(subject.transaction_details).to be_empty
      end
    end

    context "when there is a transfer within the date range" do
      include_context "when there is a transfer within the date range"

      it "does not return any detail attributes" do
        expect(subject.transaction_details).to be_empty
      end
    end
  end

  describe "#over_under_budget" do
    subject { described_class.new(interval) }

    include_context "with a user and an interval"

    let(:monthly_category) { create(:category, :monthly, user_group: user.group) }
    let(:monthly_item) do
      create(:budget_item, interval: interval, category: monthly_category)
    end
    let(:monthly_presenter) do
      instance_double(Presenters::Budget::MonthlyItemPresenter, budget_impact: 10_00)
    end

    let(:day_to_day_category) { create(:category, :weekly, user_group: user.group) }
    let(:day_to_day_item) do
      create(:weekly_item, interval: interval, category: day_to_day_category)
    end
    let(:day_to_day_presenter) do
      instance_double(Presenters::Budget::DayToDayExpensePresenter, budget_impact: -50_80)
    end

    before do
      allow(Presenters::Budget::MonthlyItemPresenter)
        .to receive(:new)
        .with(monthly_item)
        .and_return(monthly_presenter)
      allow(Presenters::Budget::DayToDayExpensePresenter)
        .to receive(:new)
        .with(day_to_day_item)
        .and_return(day_to_day_presenter)
    end

    it "returns a sum of the items' budget impact" do
      [day_to_day_presenter, monthly_presenter].map(&:budget_impact).sum.then do |expected_amount|
        expect(subject.over_under_budget).to be expected_amount
      end
    end
  end

  describe "#transactions_total" do
    subject { described_class.new(interval) }

    context "when a detail is present within the date range" do
      include_context "when a detail is present within the date range"

      before { transaction_entry }

      it "passes the transaction detail to the detail serializer" do
        expect(subject.transactions_total).to eq transaction_entry.total
      end
    end

    context "when no details are present within the date range" do
      include_context "when no details are present within the date range"

      it "does not return any detail attributes" do
        expect(subject.transactions_total).to be_zero
      end
    end

    context "when there is a pending details and the interval is current" do
      include_context "when there is a pending details and the interval is current"

      it "returns the detail(s) attributes" do
        expect(subject.transactions_total).to eq transaction_entry.total
      end
    end

    context "when there is a pending details and the interval is not current" do
      include_context "when there is a pending details and the interval is not current"

      it "does not return any detail attributes" do
        expect(subject.transactions_total).to be_zero
      end
    end

    context "when there is a budget exclusion within the date range" do
      include_context "when there is a budget exclusion within the date range"

      it "does not return any detail attributes" do
        expect(subject.transactions_total).to be_zero
      end
    end

    context "when there is a transfer within the date range" do
      include_context "when there is a transfer within the date range"

      it "does not return any detail attributes" do
        expect(subject.transactions_total).to be_zero
      end
    end
  end

  describe "#amount" do
    subject { described_class.new(interval) }

    include_context "with a user and an interval"
    let(:account) { create(:account, user_group: user.group) }
    let(:savings_account) { create(:savings_account, user_group: user.group) }
    let(:weekly_expense) { create(:weekly_expense, interval: interval) }
    let(:weekly_expense_double) do
      instance_double(Presenters::Budget::DayToDayExpensePresenter, remaining: -143_00)
    end
    let(:monthly_expense) { create(:monthly_expense, interval: interval) }
    let(:monthly_expense_double) do
      instance_double(Presenters::Budget::MonthlyItemPresenter, remaining: -13_40)
    end
    let(:remaining) { [weekly_expense_double, monthly_expense_double].map(&:remaining).sum }
    let!(:existing_cash_flow_transaction) do
      create(
        :transaction_entry,
        account: account,
        clearance_date: (interval.first_date - 10.days),
        details_attributes: [
          {
            key: KeyGenerator.call,
            amount: rand(1..100_00),
          },
        ]
      )
    end

    before do
      allow(Presenters::Budget::DayToDayExpensePresenter)
        .to receive(:new)
        .with(weekly_expense)
        .and_return(weekly_expense_double)
      allow(Presenters::Budget::MonthlyItemPresenter)
        .to receive(:new)
        .with(monthly_expense)
        .and_return(monthly_expense_double)
      create(
        :transaction_entry,
        :budget_exclusion,
        account: savings_account,
        clearance_date: (interval.first_date - 10.days),
        details_attributes: [
          {
            key: KeyGenerator.call,
            amount: rand(1..100_00),
          },
        ]
      )
    end

    context "when future" do
      before { travel_to(interval.first_date - 1.day) }

      context "when there are no budget inclusions in non-cash-flow accounts, no pending transactions" do
        it "returns the remaining only" do
          expect(subject.amount).to be remaining
        end
      end

      context "when there are no budget inclusions in non-cash-flow accounts, some pending transactions" do
        before do
          create(
            :transaction_entry,
            account: account,
            clearance_date: nil,
            details_attributes: [
              {
                key: KeyGenerator.call,
                amount: rand(1..100_00),
              },
            ]
          )
        end

        it "returns the remaining amount only" do
          expect(subject.amount).to be remaining
        end
      end

      context "when there are some cleared transactions in the interval" do
        let!(:current_transaction) do
          create(
            :transaction_entry,
            account: savings_account,
            clearance_date: interval.date_range.to_a.sample,
            details_attributes: [
              {
                key: KeyGenerator.call,
                amount: rand(1..100_00),
              },
            ]
          )
        end

        it "returns the cash flow balance for the interval plus remaining" do
          expect(subject.amount).to be(remaining + current_transaction.total)
        end
      end

      context "when there are cleared budget inclusions in non-cash-flow accounts" do
        let!(:current_transaction) do
          create(
            :transaction_entry,
            account: savings_account,
            clearance_date: interval.date_range.to_a.sample,
            details_attributes: [
              {
                key: KeyGenerator.call,
                amount: rand(1..100_00),
              },
            ]
          )
        end

        it "returns the total for the budget inclusion(s) plus remaining" do
          expect(subject.amount).to be(remaining + current_transaction.total)
        end
      end
    end

    context "when current" do
      before { travel_to(interval.date_range.to_a.sample) }

      context "when there are no budget inclusions in non-cash-flow accounts, no pending transactions" do
        before do
          create(
            :transaction_entry,
            account: account,
            clearance_date: (interval.last_date + 1.day),
            details_attributes: [
              {
                key: KeyGenerator.call,
                amount: rand(1..100_00),
              },
            ]
          )
        end

        let!(:current_transaction) do
          create(
            :transaction_entry,
            account: account,
            clearance_date: interval.date_range.to_a.sample,
            details_attributes: [
              {
                key: KeyGenerator.call,
                amount: rand(1..100_00),
              },
            ]
          )
        end

        it "returns the remaining and the balance prior to the last date of the cash flow accounts" do
          expect(subject.amount)
            .to be(remaining + current_transaction.total + existing_cash_flow_transaction.total)
        end
      end

      context "when there are no budget inclusions in non-cash-flow accounts, some pending transactions" do
        let!(:pending_transaction) do
          create(
            :transaction_entry,
            account: account,
            clearance_date: nil,
            details_attributes: [
              {
                key: KeyGenerator.call,
                amount: rand(1..100_00),
              },
            ]
          )
        end

        it "returns the remaining and the balance prior to the last date of the cash flow accounts" do
          expect(subject.amount)
            .to be(remaining + existing_cash_flow_transaction.total + pending_transaction.total)
        end
      end

      context "when there are some cleared budget inclusions in non-cash-flow accounts" do
        let!(:cleared_budget_inclusion) do
          create(
            :transaction_entry,
            budget_exclusion: false,
            account: savings_account,
            clearance_date: interval.date_range.to_a.sample,
            details_attributes: [
              {
                key: KeyGenerator.call,
                amount: rand(1..100_00),
              },
            ]
          )
        end

        it "returns the remaining plus the balance of cash flow accounts and cleared budget inclusions" do
          expect(subject.amount)
            .to be(remaining + existing_cash_flow_transaction.total + cleared_budget_inclusion.total)
        end
      end

      context "when there are some pending budget inclusions in non-cash-flow accounts" do
        let!(:pending_budget_inclusion) do
          create(
            :transaction_entry,
            budget_exclusion: false,
            account: savings_account,
            clearance_date: nil,
            details_attributes: [
              {
                key: KeyGenerator.call,
                amount: rand(1..100_00),
              },
            ]
          )
        end

        it "returns the remaining plus the balance of cash flow accounts and pending budget inclusions" do
          expect(subject.amount)
            .to be(remaining + existing_cash_flow_transaction.total + pending_budget_inclusion.total)
        end
      end
    end

    context "when in the past" do
      before { travel_to(interval.last_date + 1.day) }

      context "when there are no budget inclusions in non-cash-flow accounts, no pending transactions" do
        it "returns the remaining plus existing cash flow" do
          expect(subject.amount).to be(remaining + existing_cash_flow_transaction.total)
        end
      end

      context "when there are no budget inclusions in non-cash-flow accounts, some pending transactions" do
        before do
          create(
            :transaction_entry,
            account: account,
            clearance_date: nil,
            details_attributes: [
              {
                key: KeyGenerator.call,
                amount: rand(1..100_00),
              },
            ]
          )
        end

        it "returns the remaining plus existing cash flow" do
          expect(subject.amount).to be(remaining + existing_cash_flow_transaction.total)
        end
      end

      context "when there are some cleared budget inclusions in non-cash-flow accounts" do
        before do
          create(
            :transaction_entry,
            :budget_exclusion,
            account: savings_account,
            clearance_date: nil,
            details_attributes: [
              {
                key: KeyGenerator.call,
                amount: rand(1..100_00),
              },
            ]
          )
        end

        it "returns the remaining plus existing cash flow" do
          expect(subject.amount).to be(remaining + existing_cash_flow_transaction.total)
        end
      end

      context "when there are some pending budget inclusions in non-cash-flow accounts" do
        before do
          create(
            :transaction_entry,
            :budget_exclusion,
            account: savings_account,
            clearance_date: interval.date_range.to_a.sample,
            details_attributes: [
              {
                key: KeyGenerator.call,
                amount: rand(1..100_00),
              },
            ]
          )
        end

        it "returns the remaining plus existing cash flow" do
          expect(subject.amount).to be(remaining + existing_cash_flow_transaction.total)
        end
      end
    end
  end
end
