require "rails_helper"

RSpec.describe Budget::Changes::Rollover::EventsReducer do
  subject(:events) { described_class.new(change_set.reload).events }

  let(:change_set) do
    Budget::Changes::Rollover.new(
      interval: base_interval,
      key: KeyGenerator.call
    )
  end

  let(:user_group) { create(:user_group) }
  let(:base_interval) { create(:budget_interval, user_group:) }
  let(:upcoming) { base_interval.next }
  let(:base_change_set) do
    Budget::Changes::Setup.create(interval: base_interval)
  end
  let(:upcoming_change_set) do
    Budget::Changes::Adjust.create(interval: upcoming)
  end
  let(:groceries) { create(:category, :weekly, :expense, user_group:) }
  let(:rent) { create(:category, :monthly, :expense, user_group:) }

  def budget_item(category:, interval:, change_set:, amount:)
    create(:budget_item, category:, interval:).tap do |item|
      create(:budget_item_event, :item_create, item:, amount:, change_set:)
    end
  end

  def review_item(category:, amount: -100_00)
    budget_item(category:, amount:,
      interval: base_interval, change_set: base_change_set)
  end

  def upcoming_item(category:, amount:)
    budget_item(category:, amount:,
      interval: upcoming, change_set: upcoming_change_set)
  end

  def stored_category(category)
    change_set
      .reload
      .events_data
      .fetch("categories")
      .find { |cat| cat["slug"] == category.slug }
  end

  def target_keys(category, event_type)
    stored_category(category)
      .fetch("target_events")
      .select { |event| event["event_type"] == event_type }
      .pluck("key")
  end

  def review(category, item, **changes)
    change_set.update_review_item(slug: category.slug, item_key: item.key,
      **changes)
  end

  def upcoming_month = { month: upcoming.month, year: upcoming.year }

  context "with a Simple create" do
    let!(:item) { review_item(category: groceries) }

    before do
      change_set.assign_categories
      review(groceries, item, adjustment: -100_00)
    end

    it "creates a new item in the category for the adjustment" do
      target = stored_category(groceries).fetch("target_events").first

      expect(events).to contain_exactly(
        event_type: Budget::EventTypes::ROLLOVER_ITEM_CREATE,
        budget_item_key: target["budget_item_key"],
        budget_category_key: groceries.key,
        amount: -100_00,
        data: {},
        **upcoming_month
      )
    end
  end

  context "with a Simple adjust" do
    let!(:item) { review_item(category: groceries) }
    let!(:target_item) { upcoming_item(category: groceries, amount: -50_00) }

    before do
      change_set.assign_categories
      review(groceries, item, adjustment: -40_00)
    end

    it "adjusts the upcoming item to its new total" do
      expect(events).to contain_exactly(
        event_type: Budget::EventTypes::ROLLOVER_ITEM_ADJUST,
        budget_item_key: target_item.key,
        amount: -90_00,
        data: {},
        **upcoming_month
      )
    end
  end

  context "with a Complex category" do
    let!(:items) { Array.new(2) { review_item(category: rent) } }

    before { change_set.assign_categories }

    it "sums the items pointed at one target into one event" do
      target_key = target_keys(rent, "item_create").first
      review(rent, items.first, adjustment: -40_00, event_key: target_key)
      review(rent, items.last, adjustment: -100_00, event_key: target_key)

      expect(events.size).to be 1
      expect(events.first).to include(
        event_type: Budget::EventTypes::ROLLOVER_ITEM_CREATE,
        budget_category_key: rent.key,
        amount: -140_00
      )
    end

    it "makes one event per target" do
      first_key, last_key = target_keys(rent, "item_create")
      review(rent, items.first, adjustment: -40_00, event_key: first_key)
      review(rent, items.last, adjustment: -100_00, event_key: last_key)

      expect(events.pluck(:amount)).to contain_exactly(-40_00, -100_00)
      expect(events.pluck(:budget_item_key).uniq.size).to be 2
    end

    it "skips items that don't roll over" do
      target_key = target_keys(rent, "item_create").first
      review(rent, items.first, adjustment: 0, event_key: "none")
      review(rent, items.last, adjustment: -100_00, event_key: target_key)

      expect(events.pluck(:amount)).to eq [ -100_00 ]
    end

    it "skips targets that add up to zero" do
      target_key = target_keys(rent, "item_create").first
      items.each do |item|
        review(rent, item, adjustment: 0, event_key: target_key)
      end

      expect(events).to be_empty
    end
  end

  describe "the unapplied target" do
    let(:dining) { create(:category, :weekly, :expense, user_group:) }
    let!(:item) { review_item(category: groceries) }

    before { change_set.assign_categories }

    def pick_dining
      change_set.update_unapplied_target_event(
        key: KeyGenerator.call,
        event_type: Budget::EventTypes::ITEM_CREATE,
        budget_category_key: dining.key,
        budget_item_key: "abc123def456",
        name: dining.name,
        slug: dining.slug
      )
    end

    it "puts the unapplied total in a new item in the picked category" do
      review(groceries, item, adjustment: -40_00)
      pick_dining

      expect(events).to include(
        event_type: Budget::EventTypes::ROLLOVER_EXTRA_TARGET_CREATE,
        budget_item_key: "abc123def456",
        budget_category_key: dining.key,
        amount: -60_00,
        data: {},
        **upcoming_month
      )
    end

    it "makes no unapplied event when everything rolls over" do
      review(groceries, item, adjustment: -100_00)

      expect(events.pluck(:event_type))
        .not_to include(Budget::EventTypes::ROLLOVER_EXTRA_TARGET_CREATE)
    end
  end

  describe "#missing_item_keys?" do
    let!(:item) { review_item(category: groceries) }

    before do
      change_set.assign_categories
      review(groceries, item, adjustment: -100_00)
    end

    it "is false for current data" do
      expect(described_class.new(change_set.reload)).not_to be_missing_item_keys
    end

    it "is true for data stored before targets knew their item" do
      data = change_set.events_data.deep_dup
      data["categories"].each do |category|
        category["target_events"].each do |event|
          event.delete("budget_item_key")
        end
      end
      change_set.update!(events_data: data)

      expect(described_class.new(change_set.reload)).to be_missing_item_keys
    end
  end
end
