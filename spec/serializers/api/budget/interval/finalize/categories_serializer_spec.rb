require "rails_helper"

RSpec.describe API::Budget::Interval::Finalize::CategoriesSerializer do
  describe "#first_date" do
    subject { described_class.new(interval).first_date }

    let(:interval) { build(:budget_interval) }

    specify do
      expect(subject).to eq interval.first_date.strftime("%F")
    end
  end

  describe "#last_date" do
    subject { described_class.new(interval).last_date }

    let(:interval) { build(:budget_interval) }

    specify do
      expect(subject).to eq interval.last_date.strftime("%F")
    end
  end

  describe "#categories" do
    subject { described_class.new(interval).categories }

    let(:rendered) { subject.render }

    context "when a budget category has no items" do
      let(:user_group) { create(:user_group) }
      let(:interval) { create(:budget_interval, user_group: user_group) }

      before { create(:category, user_group: user_group) }

      it "responds with an emtpy object" do
        expect(subject).to eq []
      end
    end

    context "when a budget category has a base items, no target items" do
      let(:user_group) { create(:user_group) }
      let(:interval) { create(:budget_interval, user_group: user_group) }

      before do
        allow(API::Budget::Interval::Finalize::CreateEventSerializer).to receive(:new).and_call_original
      end

      context "when the crategory is monthly" do
        let(:category) { create(:category, :monthly, user_group: user_group) }

        before do
          create_list(:budget_item, 2, category: category, interval: interval)
        end

        it "responds with 2 create events" do
          expect(API::Budget::Interval::Finalize::CreateEventSerializer).to receive(:new).twice
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
        let(:category) { create(:category, :weekly, user_group: user_group) }

        before do
          create(:budget_item, category: category, interval: interval).then do |reviewable_item|
            create(:budget_item_event, :create_event, amount: -100_00, item: reviewable_item)
          end
        end

        it "responds with 1 create events" do
          expect(API::Budget::Interval::Finalize::CreateEventSerializer).to receive(:new).once
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
      let(:user_group) { create(:user_group) }
      let(:interval) { create(:budget_interval, user_group: user_group) }

      before do
        allow(API::Budget::Interval::Finalize::CreateEventSerializer).to receive(:new).and_call_original
        allow(API::Budget::Interval::Finalize::AdjustEventSerializer).to receive(:new).and_call_original
      end

      context "when the category is monthly" do
        let(:category) { create(:category, :monthly, user_group: user_group) }

        before do
          create(:budget_item, category: category, interval: interval)
          create(:budget_item, category: category, interval: interval.next)
        end

        it "responds with a create events and an adjust event" do
          expect(API::Budget::Interval::Finalize::CreateEventSerializer).to receive(:new).once
          expect(API::Budget::Interval::Finalize::AdjustEventSerializer).to receive(:new).once
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
          expect(rendered.first.deep_symbolize_keys[:events].first).to include(rolloverAmount: nil)
          expect(rendered.first.deep_symbolize_keys[:events].size).to be 2
        end
      end

      context "when the category is a monthly accrual" do
        let(:category) { create(:category, :weekly, :accrual, user_group: user_group) }

        before do
          create(:budget_item, category: category, interval: interval, key: "1234567890ab").then do |item|
            create(:budget_item_event, :create_event, item: item, amount: -100_00, key: "1234567890ab")
            create(:transaction_detail, budget_item: item, amount: -20_00)
          end
          create(:budget_item, category: category, interval: interval.next).then do |item|
            create(:budget_item_event, :create_event, item: item, amount: -100_00)
          end
        end

        it "responds with an adjust event only" do
          expect(rendered.first.deep_symbolize_keys[:events].first).to include(rolloverAmount: -80_00)
          expect(subject.size).to be 1
          expect(rendered.first.deep_symbolize_keys[:events].size).to be 1
        end
      end

      context "when the category is day to day" do
        let(:category) { create(:category, :expense, :weekly, user_group: user_group) }
        let(:reviewable_item) { create(:budget_item, category: category, interval: interval) }

        before do
          create(:budget_item_event, :create_event, amount: -100_00, item: reviewable_item)
          create(:budget_item, category: category, interval: interval.next)
        end

        it "responds with an adjust event only" do
          expect(API::Budget::Interval::Finalize::CreateEventSerializer).not_to receive(:new)
          expect(API::Budget::Interval::Finalize::AdjustEventSerializer).to receive(:new).once
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
