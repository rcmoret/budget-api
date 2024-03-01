require "rails_helper"

RSpec.describe "POST /api/budget/events" do
  subject do
    post(api_budget_items_events_path(month, year),
         params: params,
         headers: headers)
  end

  context "when passing a single, valid event" do
    include_context "with valid token"

    let(:icon) { create(:icon) }
    let(:category) { create(:category, :expense, icon: icon, user_group: user.group) }
    let(:interval) { create(:budget_interval, :set_up, user_group: user.group) }
    let(:event_type) { "item_create" }
    let(:month) { interval.month }
    let(:year) { interval.year }
    let(:amount) { rand(-100_00..-1_00) }
    let(:item_key) { SecureRandom.hex(6) }
    let(:event_key) { SecureRandom.hex(6) }
    let(:events_params) do
      [
        {
          key: event_key,
          budget_item_key: item_key,
          amount: amount,
          event_type: event_type,
          month: month,
          year: year,
          budget_category_key: category.key,
        },
      ]
    end
    let(:params) { { events: events_params } }
    let(:expected_response) do
      {
        discretionary: {
          amount: amount,
          overUnderBudget: 0,
          transactionDetails: [],
          transactionsTotal: 0,
        },
        items: [
          {
            key: item_key,
            name: category.name,
            budgetCategoryKey: category.key,
            amount: amount,
            difference: amount,
            remaining: amount,
            spent: 0,
            iconClassName: icon.class_name,
            isAccrual: category.accrual?,
            isDeletable: true,
            isExpense: category.expense?,
            isMonthly: category.monthly?,
            isPerDiemEnabled: category.per_diem_enabled?,
          },
        ],
      }
    end

    before { freeze_time }

    it "creates a new item" do
      expect { subject }
        .to change { Budget::Item.belonging_to(user).count }
        .by(+1)
      expect(response).to have_http_status :ok
      body = response.parsed_body.deep_symbolize_keys
      expect(body).to eq(expected_response)
    end
  end

  context "when passing a single, invalid event" do
    include_context "with valid token"

    let(:icon) { create(:icon) }
    let(:category) { create(:category, :expense, icon: icon, user_group: user.group) }
    let(:interval) { create(:budget_interval, :set_up, user_group: user.group) }
    let(:event_type) { "item_create" }
    let(:month) { interval.month }
    let(:year) { interval.year }
    let(:amount) { rand(10_00..100_00) }
    let(:item_key) { SecureRandom.hex(6) }
    let(:event_key) { SecureRandom.hex(6) }
    let(:events_params) do
      [
        {
          key: event_key,
          budget_item_key: item_key,
          amount: amount,
          event_type: event_type,
          month: month,
          year: year,
          budget_category_key: category.key,
        },
      ]
    end
    let(:params) { { events: events_params } }

    it "does not create a new item" do
      expect { subject }
        .not_to(change { Budget::Item.belonging_to(user).count })
      expect(response).to have_http_status :unprocessable_entity
      body = response.parsed_body
      expect(body).to eq(
        "eventsForm" => {
          "createItemForm.#{event_key}" => [
            {
              "amount" => "expense items must be less than or equal to 0",
            },
          ],
        }
      )
    end
  end

  context "when the params are not correctly nested" do
    include_context "with valid token"

    let(:month)  { rand(1..12) }
    let(:year) { Time.current.year }
    let(:params) do
      {
        ev: [
          {
            key: SecureRandom.hex(6),
            budget_item_key: SecureRandom.hex(6),
            amount: rand(100),
            budget_category_key: SecureRandom.hex(6),
          },
        ],
      }
    end

    it "responds with a 400, errors" do
      subject
      expect(response).to have_http_status :bad_request
      expect(response.parsed_body).to eq(
        "error" => "param is missing or the value is empty: events",
      )
    end
  end

  context "when passing an invalid month year combination" do
    include_context "with valid token"

    let(:params) { { events: [] } }

    it_behaves_like "endpoint requires budget interval"
  end

  context "with an invalid token" do
    let(:events_params) { [] }
    let(:month) { rand(1..12) }
    let(:year) { rand(2020..2035) }

    it_behaves_like "a token authenticated endpoint"
  end
end
