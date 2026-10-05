require "rails_helper"

RSpec.describe "WebApp::Budget::Rollover::ResetController", :inertia do
  let(:user) { create(:user) }
  let(:user_group) { user.group }
  let(:interval) { create(:budget_interval, month: 6, year: 2026, user_group:) }
  let(:setup_change_set) { Budget::Changes::Setup.create(interval:) }
  let(:rent) do
    create(:category, :monthly, :expense, name: "Rent", user_group:)
  end
  let(:path) { "/budget/#{interval.month}/#{interval.year}/roll-over" }

  around do |example|
    travel_to(Time.zone.local(2026, 7, 15, 12, 0, 0)) { example.run }
  end

  before { sign_in(user) }

  def review_item(category:, amount: -100_00)
    create(:budget_item, category:, interval:).tap do |item|
      create(:budget_item_event, :item_create,
        item:, user:, amount:, change_set: setup_change_set)
    end
  end

  def stored_slugs
    Budget::Changes::Rollover
      .find_by!(interval:)
      .events_data
      .fetch("categories")
      .pluck("slug")
  end

  it "rebuilds the categories from the current budget items" do
    review_item(category: rent)
    get path
    groceries = create(:category, :weekly, :expense, user_group:)
    review_item(category: groceries)

    expect { delete path }
      .to change { stored_slugs }
      .from([ rent.slug ])
      .to(contain_exactly(rent.slug, groceries.slug))
  end

  it "drops the adjustments picked so far" do
    item = review_item(category: rent)
    get path
    put "#{path}/#{rent.slug}",
      params: { item: { key: item.key, adjustment: { cents: -40_00 } } }

    delete path

    stored_item = Budget::Changes::Rollover
                  .find_by!(interval:)
                  .events_data
                  .dig("categories", 0, "items", 0)
    expect(stored_item["adjustment"]).to eq("cents" => 0, "display" => "")
  end

  it "redirects to the form" do
    review_item(category: rent)
    get path

    delete path

    expect(response).to redirect_to(path)
  end

  it "redirects to the form when there's no change set yet" do
    delete path

    expect(response).to redirect_to(path)
  end
end
