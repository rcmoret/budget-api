require "rails_helper"

RSpec.describe "WebApp::Budget::Rollover::UpdateItemController", :inertia do
  let(:user) { create(:user) }
  let(:user_group) { user.group }
  let(:interval) { create(:budget_interval, month: 6, year: 2026, user_group:) }
  let(:setup_change_set) { Budget::Changes::Setup.create(interval:) }

  let(:rent) do
    create(:category, :monthly, :expense, name: "Rent", user_group:)
  end
  let(:groceries) do
    create(:category, :weekly, :expense, name: "Groceries", user_group:)
  end

  let!(:rent_items) { Array.new(2) { review_item(category: rent) } }
  let(:rent_item) { rent_items.first }

  around do |example|
    travel_to(Time.zone.local(2026, 7, 15, 12, 0, 0)) { example.run }
  end

  before do
    sign_in(user)
    get form_path
  end

  def review_item(category:, amount: -100_00)
    create(:budget_item, category:, interval:).tap do |item|
      create(:budget_item_event, :item_create,
        item:, user:, amount:, change_set: setup_change_set)
    end
  end

  def form_path(slug = nil)
    [ "/budget", interval.month, interval.year, "roll-over", slug ]
      .compact
      .join("/")
  end

  def change_set = Budget::Changes::Rollover.find_by!(interval:)

  def stored_item(slug: rent.slug, key: rent_item.key)
    change_set
      .events_data
      .fetch("categories")
      .find { |cat| cat["slug"] == slug }
      .fetch("items")
      .find { |item| item["key"] == key }
  end

  def create_event_key
    change_set
      .events_data
      .fetch("categories")
      .find { |cat| cat["slug"] == rent.slug }
      .fetch("target_events")
      .first
      .fetch("key")
  end

  def put_item(item, query: "")
    put "#{form_path(rent.slug)}#{query}", params: { item: }
  end

  it "updates only the adjustment" do
    put_item({ key: rent_item.key, adjustment: { display: "-40.00" } })

    expect(stored_item).to include(
      "adjustment" => { "cents" => -40_00, "display" => "-40.00" },
      "event_key" => nil,
      "is_reviewed" => false
    )
  end

  it "updates only the event key" do
    event_key = create_event_key

    put_item({ key: rent_item.key, event_key: })

    expect(stored_item).to include(
      "event_key" => event_key,
      "adjustment" => { "cents" => 0, "display" => "" },
      "is_reviewed" => false
    )
  end

  it "updates both, reviewing the item" do
    event_key = create_event_key

    put_item({ key: rent_item.key, event_key:, adjustment: { cents: -40_00 } })

    expect(stored_item).to include(
      "event_key" => event_key,
      "adjustment" => { "cents" => -40_00, "display" => "-40.00" },
      "unapplied_amount" => { "cents" => -60_00, "display" => "-60.00" },
      "is_reviewed" => true
    )
  end

  it "reviews a rollover none with the none event key and a zero adjustment" do
    put_item(
      { key: rent_item.key, event_key: "none", adjustment: { cents: 0 } }
    )

    expect(stored_item).to include(
      "event_key" => "none",
      "adjustment" => { "cents" => 0, "display" => "0.00" },
      "unapplied_amount" => { "cents" => -100_00, "display" => "-100.00" },
      "is_reviewed" => true
    )
  end

  it "redirects back to the category" do
    put_item({ key: rent_item.key, adjustment: { cents: -40_00 } })

    expect(response).to redirect_to(form_path(rent.slug))
  end

  it "redirects to the next category when one is given" do
    review_item(category: groceries)
    change_set.reset_data!

    put_item(
      { key: rent_item.key, adjustment: { cents: -40_00 } },
      query: "?next-category=#{groceries.slug}"
    )

    expect(response).to redirect_to(form_path(groceries.slug))
  end

  it "redirects with a warning when the item isn't in the category" do
    expect do
      put_item({ key: "not-an-item", adjustment: { cents: -40_00 } })
    end.not_to(change { change_set.events_data })

    expect(response).to redirect_to(form_path(rent.slug))
    expect(flash[:warning]).to match(/not-an-item/)
  end
end
