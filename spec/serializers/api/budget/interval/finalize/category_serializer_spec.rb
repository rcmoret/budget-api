require "rails_helper"

RSpec.describe API::Budget::Interval::Finalize::CategorySerializer do
  shared_context "with two reviewable items" do
    let(:reviewable_items) do
      create_list(:budget_item, 2, category: category, interval: interval).tap do |items|
        items.each do |item|
          create(:budget_item_event, :create_event, item: item, amount: -200_00)
        end
      end
    end
  end

  shared_context "with a single reviewable item" do
    let(:reviewable_item) do
      create(:budget_item, category: category, interval: interval).tap do |item|
        create(:budget_item_event, :create_event, item: item, amount: -200_00)
      end
    end
    let(:reviewable_items) { [reviewable_item] }
  end

  shared_context "with a single target item" do
    let(:target_item) do
      create(:budget_item, category: category, interval: target_interval).tap do |item|
        create(:budget_item_event, :create_event, item: item, amount: -130_00)
      end
    end
    let(:target_items) { [target_item] }
  end

  shared_context "with no target items" do
    let(:target_items) { [] }
  end

  describe "delegated methods" do
    subject do
      described_class.new(category, interval: interval)
    end

    let(:user_group) { create(:user_group) }
    let(:category) { create(:category, :with_icon, user_group: user_group) }
    let(:interval) { create(:budget_interval, user_group: user_group) }

    it "delegates methods to category" do
      expect(subject.render["key"]).to eq category.key
      expect(subject.render["name"]).to eq category.name
      expect(subject.render["slug"]).to eq category.slug
      expect(subject.render["iconClassName"]).to eq category.icon_class_name
      expect(subject.render["isAccrual"]).to eq category.accrual?
      expect(subject.render["isExpense"]).to eq category.expense?
      expect(subject.render["isMonthly"]).to eq category.monthly?
    end
  end

  describe "#upcoming_maturity_intervals" do
    subject do
      described_class.new(category, interval: interval)
    end

    let(:user_group) { create(:user_group) }
    let(:category) { create(:category, :accrual, user_group: user_group) }
    let(:interval) { create(:budget_interval, :current, user_group: user_group) }
    let(:upcoming_interval) { interval.next.next }
    let(:additional_upcoming_interval) { upcoming_interval.next.next }

    before do
      create(:maturity_interval, category: category, interval: interval.prev)
      create(:maturity_interval, category: category, interval: interval)
      create(:maturity_interval, category: category, interval: upcoming_interval)
      create(:maturity_interval, category: category, interval: additional_upcoming_interval)
    end

    it "returns the upcoming maturity intervals" do
      expect(subject.render["upcomingMaturityIntervals"]).to contain_exactly(
        {
          "month" => interval.month,
          "year" => interval.year,
        },
        {
          "month" => upcoming_interval.month,
          "year" => upcoming_interval.year,
        },
        {
          "month" => additional_upcoming_interval.month,
          "year" => additional_upcoming_interval.year,
        },
      )
    end
  end

  describe "#events" do
    subject do
      described_class.new(
        category,
        interval: interval,
        reviewable_items: reviewable_items,
        target_items: target_items,
      )
    end

    let(:user_group) { create(:user_group) }
    let(:interval) { create(:budget_interval, user_group: user_group) }
    let(:target_interval) { interval.next }

    context "when the category is monthly non-accrual" do
      let(:category) { create(:category, :monthly, :expense, user_group: user_group) }

      context "when there are only reviewable items" do
        include_context "with two reviewable items"
        include_context "with no target items"

        it "returns create events for each reviewable item" do
          expect(subject.events.size).to be 2
          expect(subject.events.map(&:event_type)).to contain_exactly("rollover_item_create", "rollover_item_create")
        end
      end

      context "when there are reviewable items and target items" do
        include_context "with two reviewable items"
        include_context "with a single target item"

        it "returns create events for each reviewable item and adjust events for each target item" do
          expect(subject.events.size).to be 3
          expect(subject.events.map(&:event_type))
            .to contain_exactly("rollover_item_create", "rollover_item_create", "rollover_item_adjust")
        end
      end
    end

    context "when the category is a monthly accrual" do
      let(:category) { create(:category, :accrual, :monthly, user_group: user_group) }

      context "when there are only reviewable items" do
        include_context "with two reviewable items"
        include_context "with no target items"

        it "returns create events for each reviewable item" do
          expect(subject.events.size).to be 2
          expect(subject.events.map(&:event_type)).to contain_exactly("rollover_item_create", "rollover_item_create")
        end
      end

      context "when there are the same number of reviewable items and target items" do
        include_context "with a single target item"
        include_context "with a single reviewable item"

        it "returns adjust events for each target item and no create events" do
          expect(subject.events.size).to be 1
          expect(subject.events.map(&:event_type)).to contain_exactly("rollover_item_adjust")
        end
      end

      context "when there are the more reviewable items than target items" do
        include_context "with two reviewable items"
        include_context "with a single target item"

        it "returns adjust events for each target item and create events for the difference in count" do
          expect(subject.events.size).to be 2
          expect(subject.events.map(&:event_type)).to contain_exactly("rollover_item_create", "rollover_item_adjust")
        end
      end
    end

    context "when the category is day-to-day" do
      let(:category) { create(:category, :weekly, user_group: user_group) }

      context "when there are only reviewable items" do
        include_context "with a single reviewable item"
        include_context "with no target items"

        it "returns create events for each reviewable item" do
          expect(subject.events.size).to be 1
          expect(subject.events.map(&:event_type)).to contain_exactly("rollover_item_create")
        end
      end

      context "when there are reviewable items and target items" do
        include_context "with a single reviewable item"
        include_context "with a single target item"

        it "returns adjust events for each target item and no create events" do
          expect(subject.events.size).to be 1
          expect(subject.events.map(&:event_type)).to contain_exactly("rollover_item_adjust")
        end
      end
    end
  end
end
