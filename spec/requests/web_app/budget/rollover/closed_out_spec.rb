require "rails_helper"

RSpec.describe "WebApp::Budget::Rollover closed out interval", :inertia do
  let(:user) { create(:user) }
  let(:user_group) { user.group }
  let(:interval) do
    create(:budget_interval, :closed_out, month: 6, year: 2026, user_group:)
  end
  let(:setup_change_set) { Budget::Changes::Setup.create(interval:) }
  let(:path) { "/budget/#{interval.month}/#{interval.year}/roll-over" }
  let(:dashboard_path) { "/budget/#{interval.month}/#{interval.year}" }
  let(:groceries) do
    create(:category, :weekly, :expense, name: "Groceries", user_group:)
  end
  let!(:item) do
    create(:budget_item, category: groceries, interval:).tap do |item|
      create(:budget_item_event, :item_create,
        item:, user:, amount: -100_00, change_set: setup_change_set)
    end
  end

  around do |example|
    travel_to(Time.zone.local(2026, 7, 15, 12, 0, 0)) { example.run }
  end

  before { sign_in(user) }

  shared_examples "redirects to the dashboard" do
    it "redirects to the closed out month's dashboard with a warning" do
      make_request

      expect(response).to redirect_to(dashboard_path)
      expect(flash[:warning]).to eq("Budget month is closed out")
    end

    it "doesn't start a change set" do
      expect { make_request }
        .not_to(change { Budget::Changes::Rollover.where(interval:).count })
    end
  end

  describe "GET /roll-over" do
    subject(:make_request) { get path }

    it_behaves_like "redirects to the dashboard"
  end

  describe "GET /roll-over/:slug" do
    subject(:make_request) { get "#{path}/#{groceries.slug}" }

    it_behaves_like "redirects to the dashboard"
  end

  describe "GET /roll-over/:slug with an unknown slug" do
    subject(:make_request) { get "#{path}/not-a-category" }

    it_behaves_like "redirects to the dashboard"
  end

  describe "PUT /roll-over/:slug" do
    subject(:make_request) do
      put "#{path}/#{groceries.slug}",
        params: { item: { key: item.key, adjustment: { cents: -100_00 } } }
    end

    it_behaves_like "redirects to the dashboard"
  end

  describe "PUT /roll-over" do
    subject(:make_request) do
      put path, params: {
        target: {
          key: KeyGenerator.call,
          eventType: Budget::EventTypes::ITEM_CREATE,
          budgetCategoryKey: groceries.key,
          budgetItemKey: KeyGenerator.call,
          name: groceries.name,
          slug: groceries.slug,
        },
      }, as: :json
    end

    it_behaves_like "redirects to the dashboard"
  end

  describe "DELETE /roll-over" do
    subject(:make_request) { delete path }

    it_behaves_like "redirects to the dashboard"
  end

  describe "POST /roll-over" do
    subject(:make_request) { post path }

    it_behaves_like "redirects to the dashboard"

    it "doesn't create any events" do
      expect { make_request }.not_to(change { Budget::ItemEvent.count })
    end
  end

  context "with a change set started before the month was closed out" do
    let(:interval) do
      create(:budget_interval, month: 6, year: 2026, user_group:)
    end
    let(:change_set) { Budget::Changes::Rollover.find_by!(interval:) }

    before do
      get path
      interval.update!(close_out_completed_at: Date.new(2026, 6, 30))
    end

    it "leaves the change set alone on reset" do
      expect { delete path }.not_to(change { change_set.reload.events_data })
      expect(response).to redirect_to(dashboard_path)
    end

    it "leaves the change set alone on item update" do
      expect do
        put "#{path}/#{groceries.slug}",
          params: { item: { key: item.key, adjustment: { cents: -40_00 } } }
      end.not_to(change { change_set.reload.events_data })
      expect(response).to redirect_to(dashboard_path)
    end
  end
end
