require "rails_helper"

RSpec.describe WebApp::Budget::Changes::Rollover::Query::Result::Simple do
  context "when no item exists for the upcoming month" do
    subject(:serializer) do
      described_class.with_create_event(
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

    it "exposes the category's identifying attributes" do
      expect(serializer.to_h).to include(
        "key" => category.key,
        "slug" => category.slug,
        "name" => category.name,
        "is_accrual" => false,
        "is_expense" => true,
        "is_monthly" => true,
      )
    end

    describe "#items" do
      it "maps the review item to the create event, unreviewed" do
        items = serializer.to_h.fetch("items")
        expect(items.length).to be 1
        item = items.first
        expect(item).to include(
          "key" => review_item.key,
          "event_type" => Budget::EventTypes::ITEM_CREATE,
          "adjustment" => { "cents" => 0, "display" => "" },
          "target_item_budgeted" => include("cents" => 0),
          "remaining" => include("cents" => -60_00),
          "unapplied_amount" => { "cents" => 0, "display" => "" },
          "is_valid" => true,
          "is_reviewed" => false
        )
      end
    end

    describe "#target_events" do
      it "has a single create event" do
        target_events = serializer.to_h.fetch("target_events")
        expect(target_events.length).to be 1
        target_event = target_events.first
        expect(target_event).to include(
          "event_type" => "item_create",
          "budgeted" => { "cents" => 0, "display" => "0.00" }
        )
      end
    end
  end

  context "when there is an item for the upcoming month" do
    subject(:serializer) do
      described_class.with_adjust_event(
        category:,
        target_item:,
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
    let(:target_item) do
      build_detail(
        category:,
        interval: target_interval,
        currently_budgeted: -244_00
      )
    end

    it "exposes the category's identifying attributes" do
      expect(serializer.to_h).to include(
        "key" => category.key,
        "slug" => category.slug,
        "name" => category.name,
        "is_accrual" => false,
        "is_expense" => true,
        "is_monthly" => true,
      )
    end

    describe "#items" do
      it "maps the review item to the adjust event, unreviewed" do
        items = serializer.to_h.fetch("items")
        expect(items.length).to be 1
        item = items.first
        expect(item).to include(
          "key" => review_item.key,
          "event_type" => Budget::EventTypes::ITEM_ADJUST,
          "adjustment" => { "cents" => 0, "display" => "" },
          "target_item_budgeted" => include("cents" => -244_00),
          "remaining" => { "cents" => -60_00, "display" => "-60.00" },
          "unapplied_amount" => { "cents" => 0, "display" => "" },
          "is_valid" => true,
          "is_reviewed" => false
        )
      end
    end

    describe "#target_events" do
      it "has a single adjust event with the target item budgeted" do
        events = serializer.to_h.fetch("target_events")
        expect(events.length).to be 1
        event = events.first

        expect(event).to include(
          "event_type" => "item_adjust",
          "budgeted" => {
            "cents" => -244_00,
            "display" => "-244.00",
          }
        )
      end
    end
  end
end
