require "rails_helper"

RSpec.describe Budget::Changes::Rollover do
  describe "#assign_categories" do
    # Rollover rolls the *base* interval (the interval the change set is for)
    # forward into the *target* interval (base.next, the upcoming budget).
    #
    # Only "reviewable" base items roll over:
    #   - variable: remaining != 0   (i.e. not fully spent)
    #   - fixed:    transaction_detail_count == 0   (untouched)
    #
    # Among the reviewable items the same rules as setup apply:
    #   - variable        -> a single event, create OR adjust
    #   - fixed accrual   -> a single event, create OR adjust
    #   - fixed non-accrual -> a create event for every reviewable base item,
    #                          plus an adjust event for every existing upcoming
    #                          (target interval) item
    let(:base_interval) { create(:budget_interval) }
    let(:target_interval) { base_interval.next }
    let(:user_group) { base_interval.user_group }

    let(:base_change_set) do
      Budget::Changes::Setup.create(interval: base_interval)
    end
    let(:target_change_set) do
      Budget::Changes::Adjust.create(interval: target_interval)
    end

    # A base item rolls over only when reviewable. `transactions: 1` adds a
    # transaction for the item's full amount, which makes a fixed item
    # non-reviewable (count > 0) and a variable item non-reviewable (fully
    # spent, remaining == 0).
    def base_item(category:, amount: -100_00, transactions: 0)
      create(:budget_item, category:, interval: base_interval).tap do |item|
        create(:budget_item_event, :create_event,
          item:, amount:, change_set: base_change_set)
        transactions.times do
          create(:transaction_detail, budget_item: item, amount:)
        end
      end
    end

    def target_item(category:, amount: -100_00)
      create(:budget_item, category:, interval: target_interval).tap do |item|
        create(:budget_item_event, :create_event,
          item:, amount:, change_set: target_change_set)
      end
    end

    # Runs assign_categories for the base interval and returns the event types
    # produced for the given category. Returns [] when the category is absent
    # (e.g. it had no reviewable base items).
    def assigned_event_types(category)
      change_set =
        described_class.new(interval: base_interval).assign_categories
      assigned = change_set
                 .reload
                 .events_data
                 .fetch("categories")
                 .find { |cat| cat["slug"] == category.slug }

      return [] if assigned.nil?

      assigned.fetch("events").pluck("event_type")
    end

    context "with a variable (day-to-day) category" do
      let(:category) { create(:category, :weekly, :expense, user_group:) }

      context "with a reviewable base item and no upcoming item" do
        before { base_item(category:) }

        it "rolls it into the upcoming budget as a single create event" do
          expect(assigned_event_types(category))
            .to contain_exactly("rollover_item_create")
        end
      end

      context "with a reviewable base item and an existing upcoming item" do
        before do
          base_item(category:)
          target_item(category:)
        end

        it "produces a single adjust event (not a create)" do
          expect(assigned_event_types(category))
            .to contain_exactly("rollover_item_adjust")
        end
      end

      context "when the base item is fully spent (not reviewable)" do
        before { base_item(category:, transactions: 1) }

        it "does not roll the category over" do
          expect(assigned_event_types(category)).to be_empty
        end
      end
    end

    context "with a fixed accrual category" do
      let(:category) do
        create(:category, :monthly, :expense, :accrual, user_group:)
      end

      context "with a reviewable base item and no upcoming item" do
        before { base_item(category:) }

        it "rolls it over as a single create event" do
          expect(assigned_event_types(category))
            .to contain_exactly("rollover_item_create")
        end
      end

      context "with a reviewable base item and an existing upcoming item" do
        before do
          base_item(category:)
          target_item(category:)
        end

        it "produces a single adjust event (not a create)" do
          expect(assigned_event_types(category))
            .to contain_exactly("rollover_item_adjust")
        end
      end

      context "when the base item has a transaction (not reviewable)" do
        before { base_item(category:, transactions: 1) }

        it "does not roll the category over" do
          expect(assigned_event_types(category)).to be_empty
        end
      end
    end

    context "with a fixed (non-accrual) category" do
      let(:category) { create(:category, :monthly, :expense, user_group:) }

      context "with several reviewable base items" do
        before do
          base_item(category:)
          base_item(category:)
        end

        it "rolls each one over as its own create event" do
          expect(assigned_event_types(category))
            .to contain_exactly("rollover_item_create", "rollover_item_create")
        end
      end

      context "with a reviewable base item and an existing upcoming item" do
        before do
          base_item(category:)
          target_item(category:)
        end

        it "creates the base item and adjusts the upcoming item" do
          expect(assigned_event_types(category))
            .to contain_exactly("rollover_item_create", "rollover_item_adjust")
        end
      end

      context "when one base item has a transaction (not reviewable)" do
        before do
          base_item(category:)                  # reviewable (no transactions)
          base_item(category:, transactions: 1) # not reviewable
        end

        it "only rolls over the reviewable item" do
          expect(assigned_event_types(category))
            .to contain_exactly("rollover_item_create")
        end
      end
    end

    context "when every base item in a category is non-reviewable" do
      let(:category) { create(:category, :weekly, :expense, user_group:) }

      before { base_item(category:, transactions: 1) }

      it "excludes the category entirely" do
        expect(assigned_event_types(category)).to be_empty
      end
    end
  end

  describe "#update_data" do
    subject(:change_set) do
      described_class.new(interval: base_interval).assign_categories
    end

    let(:base_interval) { create(:budget_interval) }
    let(:user_group) { base_interval.user_group }
    let(:base_change_set) do
      Budget::Changes::Setup.create(interval: base_interval)
    end
    let(:category) { create(:category, :monthly, :expense, user_group:) }

    # A reviewable base item budgeted to -100.00 (remaining -100.00).
    let!(:item) do
      create(:budget_item, category:, interval: base_interval).tap do |record|
        create(:budget_item_event, :create_event,
          item: record, amount: -100_00, change_set: base_change_set)
      end
    end

    def first_event
      change_set
        .reload
        .events_data
        .fetch("categories")
        .first
        .fetch("events")
        .first
    end

    it "starts unreviewed with nothing rolled over" do
      expect(first_event).to include(
        "updated_amount" => 0,
        "flags" => include("unreviewed" => true, "rollover_all" => false)
      )
    end

    it "applies the adjustment and recomputes the event" do
      change_set.update_data(
        events: { item.key => { display: "-100.00", cents: -100_00 } }
      )

      expect(first_event).to include(
        "updated_amount" => -100_00,
        "flags" => include(
          "rollover_all" => true,
          "rollover_none" => false,
          "unreviewed" => false
        )
      )
    end

    it "preserves adjustments for items not in the update" do
      change_set.update_data(
        events: { item.key => { display: "-40.00", cents: -40_00 } }
      )
      # A second update for no items should leave the first adjustment intact.
      change_set.update_data(events: {})

      expect(first_event).to include("updated_amount" => -40_00)
    end
  end

  describe Budget::Changes::Rollover::Presenters::Items do
    # A reviewable fixed-expense detail record budgeted to -100.00 (so its
    # remaining is -100.00).
    def detail_item(amount: -100_00)
      interval = create(:budget_interval)
      category = create(:category, :monthly, :expense,
        user_group: interval.user_group)
      item = create(:budget_item, category:, interval:)
      create(:budget_item_event, :create_event,
        item:, amount:, change_set: Budget::Changes::Setup.create(interval:))
      Budget::Details::Base.find(item.id)
    end

    def create_presenter(display:, cents:)
      described_class::CreatePresenter.new(
        detail_item, adjustment: { display:, cents: }
      )
    end

    describe "#rollover_all?" do
      it "is true when the adjustment equals the item's remaining" do
        presenter = create_presenter(display: "-100.00", cents: -100_00)

        expect(presenter.rollover_all?).to be(true)
      end

      it "is false when the adjustment is less than the remaining" do
        presenter = create_presenter(display: "-25.00", cents: -25_00)

        expect(presenter.rollover_all?).to be(false)
      end
    end

    describe "#none?" do
      it "is true when reviewed with a zero adjustment" do
        presenter = create_presenter(display: "0", cents: 0)

        expect(presenter.none?).to be(true)
      end

      it "is false when the zero adjustment is unreviewed (blank display)" do
        presenter = create_presenter(display: "", cents: 0)

        expect(presenter.none?).to be(false)
      end

      it "is false when an amount is rolled over" do
        presenter = create_presenter(display: "-100.00", cents: -100_00)

        expect(presenter.none?).to be(false)
      end
    end
  end
end
