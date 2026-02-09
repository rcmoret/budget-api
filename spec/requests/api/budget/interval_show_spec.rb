require "rails_helper"

RSpec.describe "GET /api/budget/:month/:year" do
  subject { get(api_budget_path(month, year), headers:) }

  context "with a valid request" do
    include_context "with valid token"

    let(:user) { create(:user) }
    let(:category) { create(:category, user_group: user.group) }
    let(:account) { create(:account, user_group: user.group) }
    let(:budget_item) do
      create(:budget_item, category:, interval:)
    end
    let!(:event) do
      create(:budget_item_event, :create_event, item: budget_item)
    end
    let!(:transaction_entry) do
      create(:transaction_entry, :discretionary, clearance_date: interval.first_date,
        account:)
    end
    let(:detail_key) { KeyGenerator.call }
    let!(:item_transaction_entry) do
      create(
        :transaction_entry,
        account:,
        details_attributes: [
          {
            key: detail_key,
            amount: rand(-100_00..100_00),
            budget_item:,
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
          categories: [
            {
              key: budget_item.category.key,
              slug: budget_item.category.slug,
              name: budget_item.category.name,
              defaultAmount: budget_item.category.default_amount,
              isAccrual: budget_item.category.accrual?,
              isExpense: budget_item.category.expense?,
              isMonthly: budget_item.category.monthly?,
            },
          ],
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
              isDeleted: false,
              isExpense: category.expense?,
              isMonthly: category.monthly?,
              isPerDiemEnabled: category.per_diem_enabled?,
              events: [
                {
                  key: event.key,
                  amount: event.amount,
                  comparisonDate: event.created_at.strftime("%FT%TZ"),
                  createdAt: event.created_at.strftime("%FT%TZ"),
                  typeName: event.type_name.titleize,
                  data: nil,
                },
              ],
              transactionDetails: [
                {
                  key: detail_key,
                  accountName: account.name,
                  amount: item_transaction_entry.total,
                  description: nil,
                  clearanceDate: item_transaction_entry.clearance_date.strftime("%F"),
                  comparisonDate: item_transaction_entry.clearance_date.strftime("%FT%TZ"),
                },
              ],
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
