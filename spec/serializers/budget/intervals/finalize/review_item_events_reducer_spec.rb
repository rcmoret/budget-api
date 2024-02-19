require "rails_helper"

RSpec.describe Budget::Intervals::Finalize::ReviewItemEventsReducer do
  describe "#events" do
    let(:user_group) { create(:user_group) }
    let(:interval) { build(:budget_interval, user_group: user_group) }

    before do
      allow(Budget::Intervals::Finalize::AdjustEventSerializer).to receive(:new)
      allow(Budget::Intervals::Finalize::CreateEventSerializer).to receive(:new)
    end

    context "when the category is a monthly and non-accrual" do
      let(:category) { create(:category, :monthly, user_group: user_group) }
      let(:reviewable_items) do
        [
          instance_double(Presenters::Budget::MonthlyItemPresenter),
          instance_double(Presenters::Budget::MonthlyItemPresenter),
          instance_double(Presenters::Budget::MonthlyItemPresenter),
        ]
      end
      let(:target_items) { [instance_double(Presenters::Budget::MonthlyItemPresenter)] }

      context "when there are target items" do
        subject do
          described_class.new(
            category,
            interval: interval,
            reviewable_items: reviewable_items,
            target_items: target_items
          )
        end

        it "creates an event for each reviewable item" do
          expect(Budget::Intervals::Finalize::CreateEventSerializer)
            .to receive(:new)
            .exactly(reviewable_items.size).times

          expect(subject.events.size).to be(reviewable_items.size + target_items.size)
        end
      end

      context "when there are no target items" do
        subject do
          described_class.new(
            category,
            interval: interval,
            reviewable_items: reviewable_items,
            target_items: []
          )
        end

        it "creates an event for each reviewable item" do
          expect(Budget::Intervals::Finalize::CreateEventSerializer)
            .to receive(:new)
            .exactly(reviewable_items.size)
            .times

          expect(subject.events.size).to be reviewable_items.size
        end
      end
    end

    context "when the category is day to day" do
      let(:category) { create(:category, :weekly, user_group: user_group) }
      let(:reviewable_items) { [instance_double(Presenters::Budget::DayToDayExpensePresenter)] }

      context "when there is a target item" do
        subject do
          described_class.new(
            category,
            interval: interval,
            reviewable_items: reviewable_items,
            target_items: target_items
          )
        end

        let(:target_items) { [instance_double(Presenters::Budget::DayToDayExpensePresenter)] }

        it "does not add a create event" do
          expect(Budget::Intervals::Finalize::CreateEventSerializer)
            .not_to receive(:new)
          expect(Budget::Intervals::Finalize::AdjustEventSerializer)
            .to receive(:new)
            .once

          expect(subject.events.size).to be 1
        end
      end

      context "when there are no target items" do
        subject do
          described_class.new(
            category,
            interval: interval,
            reviewable_items: reviewable_items,
            target_items: []
          )
        end

        it "creates an event for each reviewable item" do
          expect(Budget::Intervals::Finalize::CreateEventSerializer)
            .to receive(:new)
            .exactly(reviewable_items.size)
            .times

          expect(subject.events.size).to be reviewable_items.size
        end
      end
    end

    context "when the category is an accrual" do
      let(:category) { create(:category, :accrual, user_group: user_group) }
      let(:reviewable_items) { [instance_double(Presenters::Budget::DayToDayExpensePresenter)] }

      context "when there are target items" do
        subject do
          described_class.new(
            category,
            interval: interval,
            reviewable_items: reviewable_items,
            target_items: target_items
          )
        end

        let(:target_items) { [instance_double(Presenters::Budget::DayToDayExpensePresenter)] }

        it "does not add a create event" do
          expect(Budget::Intervals::Finalize::CreateEventSerializer)
            .not_to receive(:new)
          expect(Budget::Intervals::Finalize::AdjustEventSerializer)
            .to receive(:new)
            .once

          expect(subject.events.size).to be 1
        end
      end

      context "when there are no target items" do
        subject do
          described_class.new(
            category,
            interval: interval,
            reviewable_items: reviewable_items,
            target_items: []
          )
        end

        it "creates an event for each reviewable item" do
          expect(Budget::Intervals::Finalize::CreateEventSerializer)
            .to receive(:new)
            .exactly(reviewable_items.size).times

          expect(subject.events.size).to be reviewable_items.size
        end
      end
    end
  end
end
