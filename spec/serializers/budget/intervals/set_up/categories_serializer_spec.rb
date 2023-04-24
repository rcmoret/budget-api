require "rails_helper"

RSpec.describe Budget::Intervals::SetUp::CategoriesSerializer do
  describe "#first_date" do
    subject { described_class.new(interval) }

    let(:interval) { FactoryBot.create(:budget_interval) }

    specify { expect(subject.first_date).to eq interval.first_date.strftime("%F") }
  end

  describe "#last_date" do
    subject { described_class.new(interval) }

    let(:interval) { FactoryBot.create(:budget_interval) }

    specify { expect(subject.last_date).to eq interval.last_date.strftime("%F") }
  end

  describe "#budget_categories" do
    subject { described_class.new(target_interval) }

    before { FactoryBot.create(:category) }

    let(:target_interval) { FactoryBot.create(:budget_interval, :current) }
    let(:base_interval) { target_interval.prev }
    let(:user_group) { target_interval.user_group }

    context "when base interval items exists, no target items exist" do
      let(:category) { FactoryBot.create(:category, user_group: user_group) }
      let(:budget_item) do
        FactoryBot.create(:monthly_item, interval: target_interval, category: category)
      end
      let(:budget_item_double) do
        instance_double(Budget::Item, category: category, budget_interval_id: target_interval.id)
      end

      before do
        allow(Presenters::Budget::MonthlyItemPresenter)
          .to receive(:new)
          .with(budget_item)
          .and_return(budget_item_double)
      end

      it "calls the serializer with the category, and the base item" do
        expect(Budget::Intervals::SetUp::CategorySerializer)
          .to receive(:new)
          .with(category, interval: target_interval, base_items: [], target_items: [budget_item.decorated])

        subject.budget_categories
      end
    end

    context "when a target interval item exists, no base items exist" do
      let(:category) { FactoryBot.create(:category, :monthly, user_group: user_group) }
      let(:budget_item) do
        FactoryBot.create(:monthly_item, interval: base_interval, category: category)
      end
      let(:budget_item_double) do
        instance_double(Budget::Item, category: category, budget_interval_id: base_interval.id)
      end

      before do
        allow(Presenters::Budget::MonthlyItemPresenter)
          .to receive(:new)
          .with(budget_item)
          .and_return(budget_item_double)
      end

      it "calls the serializer with the category, and the base item" do
        expect(Budget::Intervals::SetUp::CategorySerializer)
          .to receive(:new)
          .with(category, interval: target_interval, base_items: [budget_item.decorated], target_items: [])

        subject.budget_categories
      end
    end

    context "when a base interval item exists, target item exists too" do
      let(:base_interval_item) do
        FactoryBot.create(:monthly_item, interval: base_interval, category: category)
      end
      let(:target_interval_item) do
        FactoryBot.create(:monthly_item, category: category, interval: target_interval)
      end
      let(:category) { FactoryBot.create(:category, user_group: user_group) }
      let(:base_interval_item_double) do
        instance_double(Budget::Item, category: category, budget_interval_id: base_interval.id)
      end
      let(:target_interval_item_double) do
        instance_double(Budget::Item, category: category, budget_interval_id: target_interval.id)
      end

      before do
        allow(Presenters::Budget::MonthlyItemPresenter)
          .to receive(:new)
          .with(target_interval_item)
          .and_return(target_interval_item_double)
        allow(Presenters::Budget::MonthlyItemPresenter)
          .to receive(:new)
          .with(base_interval_item)
          .and_return(base_interval_item_double)
      end

      it "calls the serializer with the category, and the base item, target item" do
        expect(Budget::Intervals::SetUp::CategorySerializer)
          .to receive(:new)
          .with(category,
                interval: target_interval,
                base_items: [base_interval_item.decorated],
                target_items: [target_interval_item.decorated])

        subject.budget_categories
      end
    end

    context "when no items exist" do
      let(:category) { FactoryBot.create(:category, user_group: user_group) }

      it "calls the serializer with the category and empty arrays" do
        expect(Budget::Intervals::SetUp::CategorySerializer)
          .to receive(:new)
          .with(category, interval: target_interval, base_items: [], target_items: [])

        subject.budget_categories
      end
    end
  end
end
