require "rails_helper"

RSpec.describe "POST /api/budget/events" do
  subject do
    post(api_budget_items_events_path(month, year),
      params:,
      headers:)
  end

  context "when passing a single, valid event" do
    include_context "with valid token"

    let(:icon) { create(:icon) }
    let(:category) do
      create(:category, :expense, icon:, user_group: user.group)
    end
    let(:interval) { create(:budget_interval, :set_up, user_group: user.group) }
    let(:event_type) { "item_create" }
    let(:month) { interval.month }
    let(:year) { interval.year }
    let(:amount) { rand(-100_00..-1_00) }
    let(:item_key) { KeyGenerator.call }
    let(:event_key) { KeyGenerator.call }
    let(:events_params) do
      [
        {
          key: event_key,
          budget_item_key: item_key,
          amount:,
          event_type:,
          month:,
          year:,
          budget_category_key: category.key,
        },
      ]
    end
    let(:params) { { events: events_params } }
    let(:expected_response) do
      {
        discretionary: {
          amount:,
          overUnderBudget: 0,
          transactionDetails: [],
          transactionsTotal: 0,
        },
        items: [
          {
            key: item_key,
            name: category.name,
            budgetCategoryKey: category.key,
            amount:,
            difference: amount,
            remaining: amount,
            spent: 0,
            iconClassName: icon.class_name,
            isAccrual: category.accrual?,
            isDeleted: false,
            isExpense: category.expense?,
            isMonthly: category.monthly?,
            isPerDiemEnabled: category.per_diem_enabled?,
            events: [
              {
                key: events_params.first[:key],
                amount: events_params.first[:amount],
                typeName: events_params.first[:event_type].titleize,
                createdAt: Time.current.strftime("%FT%TZ"),
                comparisonDate: Time.current.strftime("%FT%TZ"),
                data: nil,
              },
            ],
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
    let(:category) do
      create(:category, :expense, icon:, user_group: user.group)
    end
    let(:interval) { create(:budget_interval, :set_up, user_group: user.group) }
    let(:month) { interval.month }
    let(:year) { interval.year }
    let(:amount) { rand(10_00..100_00) }
    let(:item_key) { KeyGenerator.call }
    let(:event_key) { KeyGenerator.call }
    let(:events_params) do
      [
        {
          key: event_key,
          budget_item_key: item_key,
          amount:,
          event_type:,
          month:,
          year:,
          budget_category_key: category.key,
        },
      ]
    end
    let(:params) { { events: events_params } }

    context "when the event type is not valid" do
      let(:event_type) { "unsupported_create_event" }

      it "does not create a new item" do
        expect { subject }
          .not_to(change { Budget::Item.belonging_to(user).count })
        expect(response).to have_http_status :unprocessable_entity
        body = response.parsed_body
        expect(body).to eq(
          "eventsForm" => {
            "formErrors" => [ "No registered handler for #{event_type}" ],
            "events" => [],
          }
        )
      end
    end

    context "when the amount is invalid" do
      let(:event_type) { "item_create" }

      it "does not create a new item" do
        expect { subject }
          .not_to(change { Budget::Item.belonging_to(user).count })
        expect(response).to have_http_status :unprocessable_entity
        body = response.parsed_body
        expect(body).to eq(
          "eventsForm" => {
            "formErrors" => [],
            "events" => [
              {
                "key" => event_key,
                "errors" => {
                  "amount" => [ "expense items must be less than or equal to 0" ],
                },
              },
            ],
          }
        )
      end
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
            key: KeyGenerator.call,
            budget_item_key: KeyGenerator.call,
            amount: rand(100),
            budget_category_key: KeyGenerator.call,
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
