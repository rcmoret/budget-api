require "rails_helper"

RSpec.describe Budget::Intervals::SetUp::CategorySerializer do
  subject { described_class.new(category, interval: current_interval) }

  describe "delegated methods" do
    let(:icon) { create(:icon) }
    let(:category) { build(:category, icon: icon) }
    let(:current_interval) { build(:budget_interval) }

    it "delegates most methods" do
      expect(subject.key).to eq category.key
      expect(subject.name).to eq category.name
      expect(subject.slug).to eq category.slug
      expect(subject.is_accrual).to be category.accrual?
      expect(subject.is_expense).to be category.expense?
      expect(subject.is_monthly).to be category.monthly?
    end
  end

  describe "upcoming maturity intervals" do
    subject { described_class.new(category, interval: current_interval) }

    let(:category) { create(:category, :accrual, user_group: user_group) }
    let(:user_group) { create(:user_group) }
    let(:current_interval) { create(:budget_interval, :current, user_group: user_group) }
    let(:past_interval) { create(:budget_interval, :past, user_group: user_group) }
    let(:upcoming_interval) { current_interval.next }
    let(:additional_upcoming_interval) { upcoming_interval.next }

    before do
      [current_interval, past_interval, upcoming_interval, additional_upcoming_interval].each do |interval|
        create(:maturity_interval, category: category, interval: interval)
      end
    end

    it "returns the current and upcoming maturity interval" do
      expect(subject.upcoming_maturity_intervals.render).to contain_exactly(
        { "month" => current_interval.month, "year" => current_interval.year },
        { "month" => upcoming_interval.month, "year" => upcoming_interval.year },
        { "month" => additional_upcoming_interval.month, "year" => additional_upcoming_interval.year },
      )
    end
  end

  describe "#events" do
    subject do
      described_class.new(category, interval: interval, base_items: base_items, target_items: target_items)
    end

    let(:category) { create(:category, :monthly, user_group: user_group) }
    let!(:budget_item) { create(:budget_item, category: category, interval: current_interval) }
    let(:interval) { current_interval.next }
    let(:user_group) { create(:user_group) }
    let(:current_interval) { create(:budget_interval, :current, user_group: user_group) }
    let(:base_items) { [] }
    let(:target_items) { [] }

    context "when a base item exists" do
      let(:base_items) { [budget_item] }

      it "call new on the create event serializer" do
        expect(Budget::Intervals::SetUp::CreateEventSerializer)
          .to receive(:new)
          .with(budget_item, interval: interval)

        subject.events
      end
    end

    context "when a target item exists" do
      let(:target_items) { [budget_item] }

      it "call new on the create event serializer" do
        expect(Budget::Intervals::SetUp::AdjustEventSerializer)
          .to receive(:new)
          .with(budget_item)

        subject.events
      end
    end

    context "when two target items exists" do
      let(:target_items) do
        [budget_item, create(:budget_item, category: category, interval: interval)]
      end

      it "call new on the create event serializer" do
        expect(Budget::Intervals::SetUp::AdjustEventSerializer)
          .to receive(:new)
          .twice

        subject.events
      end
    end

    context "when a base and target item exist" do
      context "when the category is monthly" do
        let(:category) { create(:category, :monthly, user_group: user_group) }
        let(:base_item) { create(:budget_item, category: category, interval: current_interval.prev) }
        let(:base_items) { [base_item] }
        let(:target_items) { [budget_item] }

        it "call new on the create event serializer" do
          expect(Budget::Intervals::SetUp::CreateEventSerializer)
            .to receive(:new)
            .with(base_item, interval: interval)
          expect(Budget::Intervals::SetUp::AdjustEventSerializer)
            .to receive(:new)
            .with(budget_item)

          subject.events
        end
      end

      context "when the category is day to day" do
        let(:category) { create(:category, :weekly, user_group: user_group) }
        let(:base_item) { create(:budget_item, category: category, interval: current_interval.prev) }
        let(:base_items) { [base_item] }
        let(:target_items) { [budget_item] }

        before do
          allow(Budget::Intervals::SetUp::AdjustEventSerializer)
            .to receive(:new)
            .with(budget_item)
            .and_return(instance_double(Budget::Intervals::SetUp::AdjustEventSerializer))
        end

        it "calls new on the adjsut event serializer, but not the create" do
          expect(Budget::Intervals::SetUp::CreateEventSerializer)
            .not_to receive(:new)
          expect(Budget::Intervals::SetUp::AdjustEventSerializer)
            .to receive(:new)
            .with(budget_item)

          subject.events
        end
      end
    end
  end
end
