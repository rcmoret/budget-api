require "rails_helper"

RSpec.describe "WebApp::Budget::Changes::CreateController" do
  subject(:post_events) do
    post "/budget/events/#{interval.month}/#{interval.year}",
      params: {
        events:,
        notes:,
        redirect: { segments: [ "budget", interval.month.to_s, interval.year.to_s ] },
      },
      as: :json
  end

  let(:user) { create(:user) }
  let(:user_group) { user.group }
  let(:interval) { create(:budget_interval, :current, :set_up, user_group:) }
  let(:change_set) { create(:budget_change_set, :adjust, interval:) }
  let(:notes) { nil }

  let!(:item) do
    create(:monthly_expense, interval:).tap do |item|
      item.category.update!(user_group:)
      create(:budget_item_event, :item_create,
        item:, user:, amount: -100_00, change_set:)
    end
  end

  let(:events) do
    [
      {
        budgetItemKey: item.key,
        amount: -150_00,
        eventType: "item_adjust",
      },
    ]
  end

  before { sign_in(user) }

  def created_change_set
    ::Budget::ChangeSet.where(interval:).order(:created_at).last
  end

  context "with a non-blank notes doc" do
    let(:notes) do
      { type: "doc", content: [ { type: "paragraph", content: [ { type: "text", text: "Water heater replaced." } ] } ] }
    end

    it "persists the notes on the change_set created for this save" do
      post_events

      expect(response).to redirect_to("/budget/#{interval.month}/#{interval.year}")
      expect(created_change_set.notes["content"].to_s).to include("Water heater replaced.")
    end
  end

  context "with an all-blank notes doc" do
    let(:notes) { { type: "doc", content: [ { type: "paragraph" } ] } }

    it "nullifies the notes rather than storing an empty doc" do
      post_events

      expect(created_change_set.notes).to be_nil
    end
  end

  context "without a notes param" do
    it "still saves the events" do
      post_events

      expect(response).to redirect_to("/budget/#{interval.month}/#{interval.year}")
      expect(item.reload.amount).to eq(-150_00)
      expect(created_change_set.notes).to be_nil
    end
  end
end
