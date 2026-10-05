require "rails_helper"

RSpec.describe Budget::Changes::Rollover::Query::Result::Complex do
  subject(:complex) do
    described_class.build(
      category:,
      review_items:,
      target_items:
    )
  end

  let(:user_group) { create(:user_group) }
  let(:category) { create(:category, :monthly, :expense, user_group:) }
  let(:base_interval) { create(:budget_interval, user_group:) }
  let(:target_interval) { base_interval.next }

  let(:review_items) do
    [ -10_00, -60_00 ].map do |amount|
      build_detail(category:, interval: base_interval,
        currently_budgeted: amount)
    end
  end
  let(:target_items) do
    [ -25_00, -40_00 ].map do |amount|
      build_detail(category:, interval: target_interval,
        currently_budgeted: amount)
    end
  end

  it "exposes the category's identifying attributes" do
    expect(complex.to_h).to include(
      "key" => category.key,
      "slug" => category.slug,
      "name" => category.name,
      "is_accrual" => false,
      "is_expense" => true,
      "is_monthly" => true,
    )
  end

  it "keeps the category flags through .from_data" do
    accrual =
      create(:category, :weekly, :expense, :accrual, user_group:)
    data = described_class.build(
      category: accrual,
      review_items:,
      target_items: []
    ).to_h

    expect(described_class.from_data(data).to_h).to include(
      "is_accrual" => true,
      "is_expense" => true,
      "is_monthly" => false,
    )
  end

  describe "items, events" do
    it "returns an unassigned mapping for each review item" do
      items = complex.items
      expect(items.length).to be 2
      expect(complex.items).to all(include(
        "event_key" => nil,
        "event_type" => nil,
        "adjustment" => { "cents" => 0, "display" => "" },
        "target_item_budgeted" => { "cents" => 0, "display" => "0.00" }
      ))
      item_tuples = complex.to_h["items"].map do |item|
        item.values_at("key", "remaining")
      end
      expect(item_tuples)
        .to contain_exactly(
          [ items.first["key"], { "cents" => -10_00, "display" => "-10.00" } ],
          [ items.last["key"], { "cents" => -60_00, "display" => "-60.00" } ],
        )

      events = complex.to_h["target_events"]
      expect(events.length).to be 4
      amounts = events.pluck("budgeted").pluck("cents")
      expect(amounts).to contain_exactly(
        0,
        0,
        -25_00,
        -40_00
      )
      event_types = events.pluck("event_type")
      expect(event_types)
        .to contain_exactly(
          "item_adjust",
          "item_adjust",
          "item_create",
          "item_create"
        )
    end
  end

  describe "target event item keys" do
    def events_by_type(result)
      result.to_h["target_events"].group_by { |event| event["event_type"] }
    end

    it "points adjust events at the upcoming items" do
      adjusts = events_by_type(complex).fetch("item_adjust")

      expect(adjusts.pluck("budget_item_key"))
        .to match_array(target_items.map(&:key))
    end

    it "gives each create event its own new item key" do
      creates = events_by_type(complex).fetch("item_create")
      keys = creates.pluck("budget_item_key")

      expect(keys).to all(match(/\A\h{12}\z/))
      expect(keys.uniq.size).to be 2
    end

    it "keeps the keys through .from_data" do
      data = complex.to_h

      expect(described_class.from_data(data.deep_dup).to_h["target_events"])
        .to eq data["target_events"]
    end

    it "reads data stored before the keys existed" do
      data = complex.to_h
      data["target_events"].each { |event| event.delete("budget_item_key") }

      events = described_class.from_data(data).to_h["target_events"]

      expect(events.pluck("budget_item_key")).to all(be_nil)
    end
  end

  describe "unapplied_amount, unreviewed" do
    subject(:complex) { described_class.from_data(data) }

    let(:data) do
      {
        "key" => category.key,
        "name" => category.name,
        "slug" => category.slug,
        "items" => items,
        "target_events" => [],
      }
    end

    let(:reviewed_items) do
      [
        review_item_data(
          remaining: -10_00, adjustment: -4_00, event_key: "none"
        ),
        review_item_data(remaining: -5_00, adjustment: 0, event_key: "none"),
      ]
    end
    let(:unreviewed_item) do
      review_item_data(remaining: -20_00, adjustment: 0, event_key: nil)
    end

    def review_item_data(remaining:, adjustment:, event_key:)
      {
        "key" => KeyGenerator.call,
        "remaining" => remaining,
        "adjustment" => adjustment,
        "event_key" => event_key,
        "event_type" => nil,
        "target_item_budgeted" => 0,
      }
    end

    context "when every item is reviewed" do
      let(:items) { reviewed_items }

      it "sums the items' unapplied amounts" do
        expect(complex.to_h["unapplied_amount"])
          .to eq({ "cents" => -11_00, "display" => "-11.00" })
      end

      it "is not unreviewed" do
        expect(complex.to_h["unreviewed"]).to be false
      end
    end

    context "when any item is unreviewed" do
      let(:items) { [ *reviewed_items, unreviewed_item ] }

      it "excludes the unreviewed item from the unapplied amount" do
        expect(complex.to_h["unapplied_amount"])
          .to eq({ "cents" => -11_00, "display" => "-11.00" })
      end

      it "is unreviewed" do
        expect(complex.to_h["unreviewed"]).to be true
      end
    end
  end

  describe ".from_data" do
    subject(:complex) do
      described_class
        .from_data(data)
    end

    let(:data) { simple_serializer.to_h }
    let(:simple_serializer) do
      Budget::Changes::Rollover::Query::Result::Simple
        .with_create_event(
          category:,
          review_item:
        )
    end

    let(:user_group) { create(:user_group) }
    let(:category) { create(:category, :monthly, :expense, user_group:) }
    let(:base_interval) { create(:budget_interval, user_group:) }
    let(:target_interval) { base_interval.next }

    let(:review_item) do
      build_detail(
        category:,
        interval: base_interval,
        currently_budgeted: -60_00
      )
    end

    it "serializes correctly" do
      complex.to_h
    end
  end
end
