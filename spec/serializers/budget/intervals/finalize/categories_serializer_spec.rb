require "rails_helper"

RSpec.describe Budget::Intervals::Finalize::CategoriesSerializer do
  describe "#first_date" do
    subject { described_class.new(interval).first_date }

    let(:interval) { FactoryBot.build(:budget_interval) }

    specify do
      expect(subject).to eq interval.first_date.strftime("%F")
    end
  end

  describe "#last_date" do
    subject { described_class.new(interval).last_date }

    let(:interval) { FactoryBot.build(:budget_interval) }

    specify do
      expect(subject).to eq interval.last_date.strftime("%F")
    end
  end

  describe "#budget_categories" do
    subject { described_class.new(interval).budget_categories }

    let(:rendered) { subject.render }

    context "when a budget category has no items" do
      let(:user_group) { FactoryBot.create(:user_group) }
      let(:interval) { FactoryBot.create(:budget_interval, user_group: user_group) }

      before { FactoryBot.create(:category, user_group: user_group) }

      it "responds with an emtpy object" do
        expect(subject).to eq []
      end
    end

    context "when a budget category has a base items, no target items" do
      let(:user_group) { FactoryBot.create(:user_group) }
      let(:interval) { FactoryBot.create(:budget_interval, user_group: user_group) }

      before do
        allow(Budget::Intervals::Finalize::CreateEventSerializer).to receive(:new).and_call_original
      end

      context "when the crategory is monthly" do
        let(:category) { FactoryBot.create(:category, :monthly, user_group: user_group) }

        before do
          FactoryBot.create_list(:budget_item, 2, category: category, interval: interval.prev)
        end

        it "responds with 2 create events" do
          expect(Budget::Intervals::Finalize::CreateEventSerializer).to receive(:new).twice
          expect(subject.size).to be 1
          expect(rendered.first.deep_symbolize_keys).to include(
            key: category.key,
            name: category.name,
            slug: category.slug,
            iconClassName: category.icon_class_name,
            isAccrual: category.accrual?,
            isExpense: category.expense?,
            isMonthly: category.monthly?,
          )
          expect(rendered.first.deep_symbolize_keys[:events].size).to be 2
        end
      end

      context "when the crategory is weekly" do
        let(:category) { FactoryBot.create(:category, :weekly, user_group: user_group) }

        before do
          FactoryBot.create(:budget_item, category: category, interval: interval.prev).then do |reviewable_item|
            FactoryBot.create(:budget_item_event, :create_event, amount: -100_00, item: reviewable_item)
          end
        end

        it "responds with 1 create events" do
          expect(Budget::Intervals::Finalize::CreateEventSerializer).to receive(:new).once
          expect(subject.size).to be 1
          expect(rendered.first.deep_symbolize_keys).to include(
            key: category.key,
            name: category.name,
            slug: category.slug,
            iconClassName: category.icon_class_name,
            isAccrual: category.accrual?,
            isExpense: category.expense?,
            isMonthly: category.monthly?,
          )
          expect(rendered.first.deep_symbolize_keys[:events].size).to be 1
        end
      end
    end

    context "when a budget category has a base items, and a target items" do
      let(:user_group) { FactoryBot.create(:user_group) }
      let(:interval) { FactoryBot.create(:budget_interval, user_group: user_group) }

      before do
        allow(Budget::Intervals::Finalize::CreateEventSerializer).to receive(:new).and_call_original
        allow(Budget::Intervals::Finalize::AdjustEventSerializer).to receive(:new).and_call_original
      end

      context "when the category is monthly" do
        let(:category) { FactoryBot.create(:category, :monthly, user_group: user_group) }

        before do
          FactoryBot.create(:budget_item, category: category, interval: interval.prev)
          FactoryBot.create(:budget_item, category: category, interval: interval)
        end

        it "responds with a create events and an adjust event" do
          expect(Budget::Intervals::Finalize::CreateEventSerializer).to receive(:new).once
          expect(Budget::Intervals::Finalize::AdjustEventSerializer).to receive(:new).once
          expect(subject.size).to be 1
          expect(rendered.first.deep_symbolize_keys).to include(
            key: category.key,
            name: category.name,
            slug: category.slug,
            iconClassName: category.icon_class_name,
            isAccrual: category.accrual?,
            isExpense: category.expense?,
            isMonthly: category.monthly?,
          )
          expect(rendered.first.deep_symbolize_keys[:events].size).to be 2
        end
      end

      context "when the category is a monthly accrual" do
        let(:category) { FactoryBot.create(:category, :monthly, :accrual, user_group: user_group) }

        before do
          FactoryBot.create(:budget_item, category: category, interval: interval.prev)
          FactoryBot.create(:budget_item, category: category, interval: interval)
        end

        it "responds with an adjust event only" do
          expect(Budget::Intervals::Finalize::CreateEventSerializer).not_to receive(:new)
          expect(Budget::Intervals::Finalize::AdjustEventSerializer).to receive(:new).once
          expect(subject.size).to be 1
          expect(rendered.first.deep_symbolize_keys[:events].size).to be 1
        end
      end

      context "when the category is day to day" do
        let(:category) { FactoryBot.create(:category, :expense, :weekly, user_group: user_group) }
        let(:reviewable_item) { FactoryBot.create(:budget_item, category: category, interval: interval.prev) }

        before do
          FactoryBot.create(:budget_item_event, :create_event, amount: -100_00, item: reviewable_item)
          FactoryBot.create(:budget_item, category: category, interval: interval)
        end

        it "responds with an adjust event only" do
          expect(Budget::Intervals::Finalize::CreateEventSerializer).not_to receive(:new)
          expect(Budget::Intervals::Finalize::AdjustEventSerializer).to receive(:new).once
          expect(subject.size).to be 1
          expect(rendered.first.deep_symbolize_keys).to include(
            key: category.key,
            name: category.name,
            slug: category.slug,
            iconClassName: category.icon_class_name,
            isAccrual: category.accrual?,
            isExpense: category.expense?,
            isMonthly: category.monthly?,
          )
          expect(rendered.first.deep_symbolize_keys[:events].size).to be 1
        end
      end
    end
  end
end
