require "rails_helper"

CategoryPair = Data.define(:category, :events)

RSpec.describe Budget::Changes::Setup do
  describe "#update_category_events" do
    subject(:change_set) do
      described_class.create(events_data:,
        interval: create(:budget_interval))
    end

    let(:budget_item_key) { KeyGenerator.call }
    let(:second_item_key) { KeyGenerator.call }
    let(:category) { create(:category, :expense) }
    let(:category_pair) do
      CategoryPair.new(
        category,
        [
          {
            amount: -100_00,
            key: budget_item_key,
          },
          {
            amount: -100_00,
            key: second_item_key,
          },
        ]
      )
    end

    let(:events_data) do
      fixture_response(
        "budget",
        "setup",
        "categories",
        categories: [
          category_pair,
        ]
      )
    end

    it "updates the events data" do
      change_set
      events = {
        budget_item_key => {
          display: "-19.99",
          cents: -19_99,
        },
      }

      change_set.update_category_events(
        category,
        events:
      )

      updated_amounts = change_set
                        .reload
                        .data_model
                        .categories
                        .first
                        .events
                        .map(&:updated_amount)
      expect(updated_amounts)
        .to contain_exactly(-19_99, 0)
    end
  end

  describe "#add_item_event" do
    subject(:change_set) do
      described_class.create(events_data:,
        interval: create(:budget_interval))
    end

    let(:category) { create(:category, :expense) }
    let(:events_data) do
      fixture_response(
        "budget",
        "setup",
        "categories",
        categories: [
          category_pair,
        ]
      )
    end
    let(:category_pair) do
      CategoryPair.new(
        category,
        [ { amount: -100_00, key: KeyGenerator.call } ]
      )
    end

    context "when adding an item to a category in the data" do
      it "adds a new event to the category" do
        expect { change_set.add_item_event(category) }
          .to change { change_set.reload.categories.flat_map(&:events).count }
          .by(+1)
      end
    end

    context "when adding an a category that isn't already in the data" do
      let(:second_category) { create(:category) }

      it "adds a new category" do
        expect { change_set.add_item_event(second_category) }
          .to change { change_set.reload.categories.count }
          .from(1)
          .to(2)
      end
    end
  end

  describe "#remove_event" do
    subject(:change_set) do
      described_class.create(events_data:,
        interval: create(:budget_interval))
    end

    let(:budget_item_key) { KeyGenerator.call }
    let(:second_item_key) { KeyGenerator.call }
    let(:category) { create(:category, :expense) }
    let(:category_pair) do
      CategoryPair.new(
        category,
        [
          {
            amount: -100_00,
            key: budget_item_key,
          },
          {
            amount: -100_00,
            key: second_item_key,
          },
        ]
      )
    end
    let(:events_data) do
      fixture_response(
        "budget",
        "setup",
        "categories",
        categories: [
          category_pair,
        ]
      )
    end

    it "allows us to remove an item" do
      expect do
        change_set.remove_event(slug: category.slug, key: budget_item_key)
      end
        .to change { change_set.reload.categories.flat_map(&:events).count }
        .by(-1)

      expect { change_set.refresh_category!(category) }
        .not_to(change do
                  change_set.reload.categories.flat_map(&:events).count
                end)
    end

    it "removes the category if removing all events" do
      expect do
        change_set.remove_event(slug: category.slug, key: budget_item_key)
        change_set.remove_event(slug: category.slug, key: second_item_key)
      end
        .to change { change_set.reload.categories.flat_map(&:events).count }
        .from(2)
        .to(0)
        .and change { change_set.reload.categories.count }
        .from(1)
        .to(0)
    end
  end

  describe "#refresh_category!" do
    subject(:change_set) do
      described_class.create(events_data:, interval:)
    end

    let(:interval) { create(:budget_interval) }
    let(:category) do
      create(:category, :expense, user_group: interval.user_group)
    end

    # A real item in the interval whose budgeted amount has since changed.
    let!(:item) do
      create(:budget_item, category:, interval:).tap do |record|
        create(:budget_item_event, :create_event,
          item: record, amount: -100_00,
          change_set: Budget::Changes::Adjust.create(interval:))
      end
    end

    # Stale stored data: the event still shows amount 0 from before the item
    # was budgeted, but the user's -25.00 adjustment should be retained.
    let(:events_data) do
      fixture_response(
        "budget",
        "setup",
        "categories",
        categories: [
          CategoryPair.new(
            category,
            [ { amount: 0, key: item.key, adjustment: { cents: -25_00 } } ]
          ),
        ]
      )
    end

    it "re-derives the event from the current item, keeping the adjustment" do
      change_set.refresh_category!(category)

      event = change_set
              .reload
              .data_model
              .categories
              .first
              .events
              .first
      # amount is read from the current item, updated_amount is recomputed,
      # and the user's adjustment is preserved.
      expect(event).to have_attributes(
        amount: -100_00,
        adjustment: { display: "-25.0", cents: -25_00 },
        updated_amount: -125_00
      )
    end
  end

  describe "#assign_categories" do
    # Naming reminder:
    #   monthly: true  -> "fixed"
    #   monthly: false -> "day-to-day" / "variable"
    #   "interval"     -> the target/current budget month
    #   "interval.prev"-> the base/previous budget month
    let(:interval) { create(:budget_interval) }
    let(:user_group) { interval.user_group }
    # A Setup change set owns the create events for the base interval's items.
    let(:base_change_set) { described_class.create(interval: interval.prev) }
    # An Adjust change set owns the events for the target interval's items.
    let(:target_change_set) { Budget::Changes::Adjust.create(interval:) }

    def base_item(category:, amount: -100_00)
      create(:budget_item, category:, interval: interval.prev).tap do |item|
        create(:budget_item_event, :create_event,
          item:, amount:, change_set: base_change_set)
      end
    end

    def target_item(category:, amount: -100_00)
      create(:budget_item, category:, interval:).tap do |item|
        create(:budget_item_event, :create_event,
          item:, amount:, change_set: target_change_set)
      end
    end

    # Runs assign_categories for `interval` and returns the event types for the
    # given category, e.g. ["setup_item_adjust", "setup_item_create"]. Returns
    # [] when the category is absent from the data (e.g. all items deleted).
    def assigned_event_types(category)
      change_set = described_class.where(interval:).new.assign_categories
      assigned = change_set
                 .reload
                 .events_data
                 .fetch("categories")
                 .find { |cat| cat["slug"] == category.slug }

      return [] if assigned.nil?

      assigned.fetch("events").pluck("event_type")
    end

    context "when there are a variety of items in play" do
      let(:prev_change_set) { described_class.create(interval: interval.prev) }
      let(:current_change_set) do
        Budget::Changes::Adjust.create(interval:)
      end
      let(:category) do
        create(:category, :revenue, user_group: interval.user_group)
      end
      let(:interval) { create(:budget_interval) }
      let(:bonus_amount) { 3_200_00 }
      let(:change_set_scope) { described_class.where(interval:) }
      let(:previous_item) do
        create(
          :budget_item,
          category:,
          interval: prev_change_set.interval
        )
      end
      let(:current_item) do
        create(
          :budget_item,
          category:,
          interval: current_change_set.interval
        )
      end

      before do
        create(
          :budget_item_event,
          :create_event,
          item: previous_item,
          amount: 5_000_00,
          change_set: prev_change_set
        )
        create(
          :budget_item_event,
          :create_event,
          item: current_item,
          amount: bonus_amount,
          change_set: current_change_set
        )
      end

      it "populates the events data" do
        change_set = change_set_scope.new.assign_categories
        expect(change_set.events_data.dig("categories", 0)).to include(
          "key" => category.key,
          "name" => category.name,
          "slug" => category.slug,
          "default_amount" => category.default_amount,
          "is_expense" => category.expense?,
          "is_monthly" => category.monthly?,
          "is_accrual" => category.accrual?,
          "is_per_diem_enabled" => category.per_diem_enabled?,
          "icon_key" => category.icon_key,
          "icon_class_name" => category.icon_class_name,
          "archived_at" => nil,
        )

        expect(change_set.events_data.dig("categories", 0, "events", 1)).to eq(
          {
            "event_type" => "setup_item_create",
            "budget_item_key" => previous_item.key,
            "spent" => 0,
            "amount" => 0,
            "updated_amount" => 0,
            "previously_budgeted" => previous_item.amount,
            "adjustment" => { "cents" => 0, "display" => "" },
            "flags" => {
              "eq_prev_budgeted" => false,
              "eq_prev_spent" => false,
              "unreviewed" => true,
              "show_default_suggestion" => true,
              "is_valid" => true,
              "has_delete_intent" => false,
            },
          },
        )
        expect(change_set.events_data.dig("categories", 0, "events", 0)).to eq(
          "event_type" => "setup_item_adjust",
          "amount" => 3_200_00,
          "budget_item_key" => current_item.key,
          "updated_amount" => 3_200_00,
          "previously_budgeted" => 0,
          "spent" => 0,
          "adjustment" => { "cents" => 0, "display" => "" },
          "flags" => {
            "eq_prev_budgeted" => true,
            "eq_prev_spent" => true,
            "unreviewed" => true,
            "show_default_suggestion" => false,
            "is_valid" => true,
            "has_delete_intent" => false,
          }
        )

        expect(change_set.events_data.dig("categories", 0,
          "events").size).to eq 2
      end
    end

    context "with a variable (day-to-day) category" do
      # A variable category has at most one item per interval, so we expect a
      # single event per category per interval.
      let(:category) { create(:category, :weekly, :expense, user_group:) }

      context "with an item only in the target interval" do
        before { target_item(category:) }

        it "produces a single adjust event" do
          expect(assigned_event_types(category))
            .to contain_exactly("setup_item_adjust")
        end
      end

      context "with an item only in the base interval" do
        before { base_item(category:) }

        it "produces a single create event" do
          expect(assigned_event_types(category))
            .to contain_exactly("setup_item_create")
        end
      end

      context "with an item in both intervals" do
        before do
          base_item(category:)
          target_item(category:)
        end

        it "adjusts the target item and offers a create for the base item" do
          expect(assigned_event_types(category))
            .to contain_exactly("setup_item_adjust", "setup_item_create")
        end
      end
    end

    context "with a fixed accrual category" do
      # Accrual fixed categories behave like variable categories here.
      let(:category) do
        create(:category, :monthly, :expense, :accrual, user_group:)
      end

      context "with an item in both intervals" do
        before do
          base_item(category:)
          target_item(category:)
        end

        it "adjusts the target item and offers a create for the base item" do
          expect(assigned_event_types(category))
            .to contain_exactly("setup_item_adjust", "setup_item_create")
        end
      end
    end

    context "with a fixed (non-accrual) category" do
      let(:category) { create(:category, :monthly, :expense, user_group:) }

      context "with several items in the target interval" do
        before do
          target_item(category:)
          target_item(category:)
        end

        it "produces an adjust event for every existing target item" do
          expect(assigned_event_types(category))
            .to contain_exactly("setup_item_adjust", "setup_item_adjust")
        end
      end

      context "with items in both intervals" do
        before do
          base_item(category:)
          target_item(category:)
        end

        it "adjusts the target item and creates the base item" do
          expect(assigned_event_types(category))
            .to contain_exactly("setup_item_adjust", "setup_item_create")
        end
      end

      context "with a base item that has been spent (not reviewable)" do
        before do
          item = base_item(category:)
          create(:transaction_detail, budget_item: item, amount: -100_00)
        end

        it "still produces a create event regardless of reviewability" do
          expect(assigned_event_types(category))
            .to contain_exactly("setup_item_create")
        end
      end
    end

    context "with deleted items" do
      let(:category) { create(:category, :monthly, :expense, user_group:) }

      it "ignores a deleted item in the base interval" do
        base_item(category:).update!(deleted_at: Time.current)

        expect(assigned_event_types(category)).to be_empty
      end

      it "ignores a deleted item in the target interval" do
        target_item(category:).update!(deleted_at: Time.current)

        expect(assigned_event_types(category)).to be_empty
      end
    end
  end

  describe "#reset_data!" do
    let(:interval) { create(:budget_interval) }
    let(:category) do
      create(:category, :weekly, :expense, user_group: interval.user_group)
    end

    it "rebuilds the categories from current items, discarding stale data" do
      item = create(:budget_item, category:, interval:)
      create(:budget_item_event, :create_event,
        item:, amount: -100_00,
        change_set: Budget::Changes::Adjust.create(interval:))

      stale = { "categories" => [ { "slug" => "stale", "events" => [] } ] }
      change_set = described_class.create(interval:, events_data: stale)

      change_set.reset_data!

      slugs = change_set
              .reload
              .events_data
              .fetch("categories")
              .pluck("slug")
      expect(slugs).to contain_exactly(category.slug)
    end
  end
end
