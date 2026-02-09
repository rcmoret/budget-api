require "rails_helper"

RSpec.describe "POST /api/budget/interval/finalize/(:month)/(:year)" do
  subject do
    post(
      api_budget_interval_finalize_events_path(*url_args),
      params:,
      headers:
    )
  end

  context "when providing a events" do
    include_context "with valid token"

    let(:interval) do
      create(:budget_interval, :current, user_group: user.group)
    end
    let(:category) { create(:category, :expense, user_group: user.group) }
    let(:amount) { rand(-100_00..-100) }
    let(:url_args) { [] }
    let(:params) do
      {
        interval: {
          events: [
            {
              amount:,
              budget_category_key: category.key,
              budget_item_key: KeyGenerator.call,
              event_type: Budget::EventTypes::CREATE_EVENTS.sample,
              month: interval.month,
              year: interval.year,
            },
          ],
        },
      }
    end

    it "creates an item and an event" do
      expect { subject }
        .to change { Budget::Item.count }
        .by(+1)
        .and change { Budget::ItemEvent.count }
        .by(+1)
    end
  end

  context "when providing a month and year" do
    include_context "with valid token"

    let(:params) { { interval: { events: [] } } }
    let(:interval) { create(:budget_interval, :past, user_group: user.group) }
    let(:url_args) { [ interval.month, interval.year ] }

    it "closes out the provided interval" do
      expect { subject }
        .to change { interval.reload.closed_out? }
        .from(false)
        .to(true)
    end
  end

  context "when not specifying a month and year" do
    include_context "with valid token"

    let(:url_args) { [] }
    let(:params) { { interval: { events: [] } } }
    let(:interval) do
      create(:budget_interval, :current, user_group: user.group)
    end

    it "closes out the current interval" do
      expect { subject }
        .to change { interval.reload.closed_out? }
        .from(false)
        .to(true)
    end
  end

  context "when passing invalid month / year params" do
    include_context "with valid token"

    let(:url_args) { [ month, year ] }
    let(:params) { {} }

    it_behaves_like "endpoint requires budget interval"
  end

  context "when the params are not correctly nested" do
    include_context "with valid token"

    let(:params) { { interval: {} } }
    let(:url_args) { [ rand(1..12), Time.current.year ] }

    it "responds with a 400, errors" do
      subject
      expect(response).to have_http_status :bad_request
      expect(response.parsed_body).to eq(
        "error" => "param is missing or the value is empty: interval",
      )
    end
  end

  context "when passing an invalid token" do
    let(:params) { {} }
    let(:url_args) { [] }

    it_behaves_like "a token authenticated endpoint"
  end
end
