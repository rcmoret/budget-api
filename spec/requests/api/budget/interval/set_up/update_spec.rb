require "rails_helper"

RSpec.describe "PUT /api/budget/intervals/set_up/:month/:year" do
  subject do
    put(
      api_budget_interval_set_up_path(month, year),
      params: params,
      headers: headers
    )
  end

  context "when passing events" do
    include_context "with valid token"

    let(:interval) { FactoryBot.create(:budget_interval, user_group: user.group) }
    let(:month) { interval.month }
    let(:year) { interval.year }
    let(:category) { FactoryBot.create(:category, :expense, user_group: user.group) }
    let(:amount) { rand(-100_00..-100) }
    let(:event_type) { "setup_item_create" }
    let(:event_key) { SecureRandom.hex(6) }
    let(:item_key) { SecureRandom.hex(6) }
    let(:params) { { interval: event_params } }
    let(:event_params) do
      {
        events: [
          {
            key: event_key,
            budget_item_key: item_key,
            amount: amount,
            event_type: event_type,
            month: month,
            year: year,
            budget_category_key: category.key,
          },
        ],
      }
    end

    fit "creates an item and event" do
      expect { subject }
        .to change { Budget::Item.count }
        .by(+1)
        .and(change { interval.reload.set_up_completed_at })
        .and(change { interval.reload.start_date })
        .and(change { interval.reload.end_date })
        .and(change { Budget::ItemEvent.count }.by(+1))
      expect(response).to have_http_status :accepted
      binding.pry
    end
  end

  context "when trying to set up a previously set up interval" do
    include_context "with valid token"

    let(:interval) { FactoryBot.create(:budget_interval, :set_up, user_group: user.group) }
    let(:month) { interval.month }
    let(:year) { interval.year }
    let(:params) { {} }

    it "returns a bad request" do
      subject
      expect(response).to have_http_status :bad_request
      expect(JSON.parse(response.body)).to eq({ "budgetInterval" => "has been set up" })
    end
  end

  context "when passing an invalid month / year combination" do
    include_context "with valid token"
    let(:params) { {} }

    it_behaves_like "endpoint requires budget interval"
  end

  context "when passing an invalid token" do
    let(:month) { rand(1..12) }
    let(:year) { rand(2020..2035) }
    let(:params) { {} }

    it_behaves_like "a token authenticated endpoint"
  end
end
