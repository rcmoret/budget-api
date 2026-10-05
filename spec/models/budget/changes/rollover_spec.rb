require "rails_helper"

RSpec.describe Budget::Changes::Rollover do
  describe ".assign_categories" do
    def base_item(category:, amount: -100_00, transactions: 0)
      # binding.pry

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

    def events_data_for(change_set, category)
      assigned = change_set
                 .reload
                 .events_data
                 .fetch("categories")
                 .find { |cat| cat["slug"] == category.slug }

      return [] if assigned.nil?

      if block_given?
        yield(assigned.fetch("events"))
      else
        assigned.fetch("events")
      end
    end

    def assigned_event_types(change_set, category)
      events_data_for(change_set, category) do |events|
        events.pluck("event_type")
      end
    end

    let(:base_interval) { create(:budget_interval, user_group:) }
    let(:user_group) { create(:user_group) }
    let(:target_interval) { base_interval.next }

    let(:base_change_set) do
      Budget::Changes::Setup.create(interval: base_interval)
    end
    let(:target_change_set) do
      Budget::Changes::Adjust.create(interval: target_interval)
    end

    context "with a variable (day-to-day) category" do
      let(:category) { create(:category, :weekly, :expense, user_group:) }

      context "with a reviewable base item and no upcoming item" do
        let(:change_set) do
          described_class.new(interval: base_interval)
        end

        before do
          # base_item(category:)
          # change_set.assign_categories
        end

        it "rolls it into the upcoming budget as a single create event" do
        end
      end
    end
  end

  describe "#update_review_item" do
    subject(:change_set) do
      described_class.new(interval: base_interval, key: KeyGenerator.call)
    end

    let(:user_group) { create(:user_group) }
    let(:base_interval) { create(:budget_interval, user_group:) }
    let(:base_change_set) do
      Budget::Changes::Setup.create(interval: base_interval)
    end
    let(:category) { create(:category, :monthly, :expense, user_group:) }
    let!(:review_items) do
      Array.new(2) do
        create(:budget_item, category:, interval: base_interval).tap do |item|
          create(:budget_item_event, :item_create,
            item:, amount: -100_00, change_set: base_change_set)
        end
      end
    end
    let(:review_item) { review_items.first }

    before { change_set.assign_categories }

    def category_data
      change_set
        .reload
        .events_data
        .fetch("categories")
        .find { |cat| cat["slug"] == category.slug }
    end

    def item_data(key = review_item.key)
      category_data.fetch("items").find { |item| item["key"] == key }
    end

    def create_event_key
      category_data.fetch("target_events").first.fetch("key")
    end

    it "recalculates the item from a new adjustment and event key" do
      event_key = create_event_key

      change_set.update_review_item(
        slug: category.slug,
        item_key: review_item.key,
        adjustment: -40_00,
        event_key:
      )

      expect(item_data).to include(
        "event_key" => event_key,
        "event_type" => Budget::EventTypes::ITEM_CREATE,
        "adjustment" => { "cents" => -40_00, "display" => "-40.00" },
        "unapplied_amount" => { "cents" => -60_00, "display" => "-60.00" },
        "is_reviewed" => true
      )
    end

    it "recalculates the category totals" do
      change_set.update_review_item(
        slug: category.slug,
        item_key: review_item.key,
        adjustment: -40_00,
        event_key: create_event_key
      )

      expect(category_data).to include(
        "unapplied_amount" => { "cents" => -60_00, "display" => "-60.00" },
        "unreviewed" => true
      )
    end

    it "updates only the adjustment" do
      change_set.update_review_item(
        slug: category.slug,
        item_key: review_item.key,
        adjustment: -40_00
      )

      expect(item_data).to include(
        "event_key" => nil,
        "adjustment" => { "cents" => -40_00, "display" => "-40.00" },
        "is_reviewed" => false
      )
    end

    it "updates only the event key, leaving the item unreviewed" do
      event_key = create_event_key

      change_set.update_review_item(
        slug: category.slug,
        item_key: review_item.key,
        event_key:
      )

      expect(item_data).to include(
        "event_key" => event_key,
        "adjustment" => { "cents" => 0, "display" => "" },
        "is_reviewed" => false
      )
    end

    it "keeps the other items and target events" do
      before_data = category_data

      change_set.update_review_item(
        slug: category.slug,
        item_key: review_item.key,
        adjustment: -40_00
      )

      expect(item_data(review_items.last.key))
        .to eq(before_data.fetch("items")
          .find { |item| item["key"] == review_items.last.key })
      expect(category_data.fetch("target_events"))
        .to eq(before_data.fetch("target_events"))
    end

    it "rejects attributes other than adjustment and event key" do
      expect do
        change_set.update_review_item(
          slug: category.slug,
          item_key: review_item.key,
          remaining: 0
        )
      end.to raise_error(ArgumentError)
    end
  end

  describe "unapplied target" do
    subject(:change_set) do
      described_class.new(interval: base_interval, key: KeyGenerator.call)
    end

    let(:user_group) { create(:user_group) }
    let(:base_interval) { create(:budget_interval, user_group:) }
    let(:base_change_set) do
      Budget::Changes::Setup.create(interval: base_interval)
    end
    let(:groceries) { create(:category, :weekly, :expense, user_group:) }
    let(:dining) { create(:category, :weekly, :expense, user_group:) }
    let(:salary) { create(:category, :monthly, :revenue, user_group:) }
    let!(:review_item) do
      create(:budget_item, category: groceries,
        interval: base_interval).tap do |item|
        create(:budget_item_event, :item_create,
          item:, amount: -100_00, change_set: base_change_set)
      end
    end

    # Groceries is a Simple category, so its target is assigned up front and
    # a zero adjustment reviews it with the whole -100.00 unapplied.
    before do
      change_set.assign_categories
      change_set.update_review_item(
        slug: groceries.slug,
        item_key: review_item.key,
        adjustment: 0
      )
    end

    def target_for(category)
      {
        key: KeyGenerator.call,
        event_type: Budget::EventTypes::ITEM_CREATE,
        budget_category_key: category.key,
        budget_item_key: KeyGenerator.call,
        name: category.name,
        slug: category.slug,
      }
    end

    def stored_target = change_set.reload.data_model.unapplied_target_event

    it "sums the unapplied amounts" do
      expect(change_set.data_model.unapplied_total)
        .to eq Money.from_cents(-100_00)
    end

    it "stores the target with its kind and the upcoming month" do
      target = target_for(dining)

      expect(change_set.update_unapplied_target_event(target)).to be true
      expect(stored_target).to eq(
        target.stringify_keys.merge(
          "is_expense" => true,
          "month" => base_interval.next.month,
          "year" => base_interval.next.year
        )
      )
    end

    it "clears the target" do
      change_set.update_unapplied_target_event(target_for(dining))

      change_set.update_unapplied_target_event(nil)

      expect(stored_target).to be_nil
    end

    it "rejects a revenue category when the total is negative" do
      expect(change_set.update_unapplied_target_event(target_for(salary)))
        .to be false
      expect(change_set.errors[:unapplied_target_event])
        .to include "must be an expense category"
      expect(stored_target).to be_nil
    end

    it "rejects another budget's category" do
      other = create(:category, :weekly, :expense)

      expect(change_set.update_unapplied_target_event(target_for(other)))
        .to be false
      expect(change_set.errors[:unapplied_target_event])
        .to include "category not found"
    end

    it "rejects an archived category" do
      dining.update!(archived_at: Time.current)

      expect(change_set.update_unapplied_target_event(target_for(dining)))
        .to be false
    end

    it "rejects a target when nothing is left to apply" do
      change_set.update_review_item(
        slug: groceries.slug,
        item_key: review_item.key,
        adjustment: -100_00
      )

      expect(change_set.update_unapplied_target_event(target_for(dining)))
        .to be false
      expect(change_set.errors[:unapplied_target_event])
        .to include "nothing left to apply"
    end

    it "is cleared by a reset" do
      change_set.update_unapplied_target_event(target_for(dining))

      change_set.reset_data!

      expect(stored_target).to be_nil
    end

    it "keeps a single, string keyed categories entry through a reset" do
      change_set.reload.reset_data!

      expect(change_set.reload.events_data.keys).to eq [ "categories" ]
    end

    describe "DataModel#unapplied_target_valid?" do
      def valid? = change_set.reload.data_model.unapplied_target_valid?

      it "is false without a target" do
        expect(valid?).to be false
      end

      it "is true with a target of the right kind" do
        change_set.update_unapplied_target_event(target_for(dining))

        expect(valid?).to be true
      end

      it "is true when nothing is left to apply" do
        change_set.update_review_item(
          slug: groceries.slug,
          item_key: review_item.key,
          adjustment: -100_00
        )

        expect(valid?).to be true
      end

      it "is false once the total's sign no longer matches the target" do
        change_set.update_unapplied_target_event(target_for(dining))
        data = change_set.events_data.deep_dup
        data["unapplied_target_event"]["is_expense"] = false
        change_set.update!(events_data: data)

        expect(valid?).to be false
      end
    end
  end

  describe "#finalize!" do
    subject(:change_set) do
      described_class.new(interval: base_interval, key: KeyGenerator.call)
    end

    let(:user) { create(:user) }
    let(:user_group) { user.group }
    let(:base_interval) { create(:budget_interval, user_group:) }
    let(:upcoming) { base_interval.next }
    let(:base_change_set) do
      Budget::Changes::Setup.create(interval: base_interval)
    end
    let(:groceries) { create(:category, :weekly, :expense, user_group:) }
    let(:dining) { create(:category, :weekly, :expense, user_group:) }
    let!(:review_item) do
      create(:budget_item, category: groceries,
        interval: base_interval).tap do |item|
        create(:budget_item_event, :item_create,
          item:, amount: -100_00, change_set: base_change_set)
      end
    end

    def review(adjustment)
      change_set.update_review_item(
        slug: groceries.slug,
        item_key: review_item.key,
        adjustment:
      )
    end

    def pick(category)
      change_set.update_unapplied_target_event(
        key: KeyGenerator.call,
        event_type: Budget::EventTypes::ITEM_CREATE,
        budget_category_key: category.key,
        budget_item_key: KeyGenerator.call,
        name: category.name,
        slug: category.slug
      )
    end

    def upcoming_detail(category)
      Budget::Details::Base.find_by(
        interval: upcoming,
        budget_category_key: category.key
      )
    end

    before { change_set.assign_categories }

    context "when everything is reviewed" do
      before do
        review(-40_00)
        pick(dining)
      end

      it "creates the rollover events in the upcoming month" do
        expect { change_set.finalize!(user) }
          .to change { Budget::ItemEvent.where(change_set:).count }.by(2)

        expect(upcoming_detail(groceries).previously_budgeted).to eq(-40_00)
        expect(upcoming_detail(dining).previously_budgeted).to eq(-60_00)
      end

      it "closes out the month and stamps the change set" do
        freeze_time do
          expect(change_set.finalize!(user)).to be true

          expect(base_interval.reload.close_out_completed_at)
            .to eq Time.current
          expect(change_set.reload.effective_at).to eq Time.current
        end
      end

      it "keeps the review data" do
        data = change_set.reload.events_data

        change_set.finalize!(user)

        expect(change_set.reload.events_data).to eq data
      end

      it "can't be finalized twice" do
        change_set.finalize!(user)

        expect(change_set.reload.finalize!(user)).to be false
        expect(change_set.errors[:base])
          .to include "this month has already been rolled over"
      end
    end

    it "saves nothing when one event fails" do
      # Dining already has a (weekly) item next month, so creating another
      # one for the unapplied amount fails.
      create(:budget_item, category: dining, interval: upcoming)
      review(-40_00)
      pick(dining)

      expect(change_set.finalize!(user)).to be false
      expect(Budget::ItemEvent.where(change_set:)).to be_empty
      expect(base_interval.reload.close_out_completed_at).to be_nil
      expect(change_set.errors[:base]).not_to be_empty
    end

    it "refuses until everything is reviewed" do
      expect(change_set.finalize!(user)).to be false
      expect(change_set.errors[:base]).to include(
        "review every category and choose where the remainder goes"
      )
    end

    it "refuses data stored before targets knew their item" do
      review(-100_00)
      data = change_set.reload.events_data.deep_dup
      data["categories"].first["target_events"].first.delete("budget_item_key")
      change_set.update!(events_data: data)

      expect(change_set.finalize!(user)).to be false
      expect(change_set.errors[:base])
        .to include "the review data is out of date; reset the rollover"
    end
  end
end
