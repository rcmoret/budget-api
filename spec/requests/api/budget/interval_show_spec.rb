require "rails_helper"

RSpec.describe "GET /api/budget/:month/:year" do
  subject { get(api_budget_path(month, year), headers: headers) }

  context "with a valid request" do
    include_context "with valid token"

    let(:user) { create(:user) }
    let(:category) { create(:category, user_group: user.group) }
    let(:account) { create(:account, user_group: user.group) }
    let(:budget_item) { create(:budget_item, category: category, interval: interval) }
    let!(:event) { create(:budget_item_event, :create_event, item: budget_item) }
    let!(:transaction_entry) do
      create(:transaction_entry, :discretionary, clearance_date: interval.first_date, account: account)
    end
    let!(:item_transaction_entry) do
      create(
        :transaction_entry,
        account: account,
        details_attributes: [
          {
            key: SecureRandom.hex(6),
            amount: rand(-100_00..100_00),
            budget_item: budget_item,
          },
        ]
      )
    end
    let(:interval) { create(:budget_interval, :past, user_group: user.group) }
    let(:month) { interval.month }
    let(:year) { interval.year }
    let(:expected) do
      {
        interval: {
          data: {
            month: interval.month,
            year: interval.year,
            daysRemaining: 0,
            firstDate: interval.first_date.strftime("%F"),
            lastDate: interval.last_date.strftime("%F"),
            totalDays: ((interval.last_date - interval.first_date).to_i + 1),
            isClosedOut: false,
            isCurrent: false,
            isSetUp: false,
          },
          discretionary: {
            amount: transaction_entry.total,
            overUnderBudget: budget_item.decorated.budget_impact,
            transactionDetails: [
              {
                key: transaction_entry.details.first.key,
                accountName: account.name,
                amount: transaction_entry.details.first.amount,
                description: nil,
                transactionEntryKey: transaction_entry.key,
                clearanceDate: transaction_entry.clearance_date.strftime("%F"),
                updatedAt: transaction_entry.updated_at.strftime("%FT%TZ"),
              },
            ],
            transactionsTotal: transaction_entry.total,
          },
          items: [
            {
              key: budget_item.key,
              budgetCategoryKey: category.key,
              name: category.name,
              amount: event.amount,
              difference: budget_item.difference,
              remaining: budget_item.decorated.remaining,
              spent: item_transaction_entry.total,
              iconClassName: nil,
              isAccrual: category.accrual,
              isDeletable: false,
              isExpense: category.expense?,
              isMonthly: category.monthly?,
              isPerDiemEnabled: category.per_diem_enabled?,
              transactionDetailCount: 1,
            },
          ],
        },
      }
    end

    before { subject }

    it "returns a lot of data" do
      expect(response).to have_http_status :ok
      body = response.parsed_body.deep_symbolize_keys
      expect(body).to eq(expected)
    end
  end

  context "when providing invalid month/year combination" do
    include_context "with valid token"
    include_examples "endpoint requires budget interval"
  end

  context "with an invalid token" do
    let(:month) { rand(1..12) }
    let(:year) { rand(2019..2039) }

    it_behaves_like "a token authenticated endpoint"
  end
end
