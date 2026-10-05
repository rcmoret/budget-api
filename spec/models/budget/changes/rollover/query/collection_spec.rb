require "rails_helper"

RSpec.describe Budget::Changes::Rollover::Query::Collection do
  subject(:query) { described_class.new(base_interval) }

  let(:user_group) { create(:user_group) }
  let(:base_interval) { create(:budget_interval, user_group:) }
  let(:target_interval) { base_interval.next }

  let(:base_change_set) do
    Budget::Changes::Setup.create(interval: base_interval)
  end
  let(:target_change_set) do
    Budget::Changes::Adjust.create(interval: target_interval)
  end

  let(:monthly_expense) { create(:category, :monthly, :expense, user_group:) }
  let(:accrual_expense) do
    create(:category, :monthly, :expense, :accrual, user_group:)
  end
  let(:variable_expense) { create(:category, :weekly, :expense, user_group:) }
  let(:variable_revenue) { create(:category, :weekly, :revenue, user_group:) }

  def budget_item(category:, interval:, change_set:, amount:, spent: [])
    create(:budget_item, category:, interval:).tap do |item|
      create(:budget_item_event, :item_create, item:, amount:, change_set:)
      spent.each do |spent_amount|
        create(:transaction_detail, budget_item: item, amount: spent_amount)
      end
    end
  end

  def base_item(category:, amount: -100_00, spent: [])
    budget_item(category:, amount:, spent:,
      interval: base_interval, change_set: base_change_set)
  end

  def target_item(category:, amount: -100_00)
    budget_item(category:, amount:,
      interval: target_interval, change_set: target_change_set)
  end

  describe "#base_details" do
    def base_detail_keys = query.base_details.map(&:key)

    context "with a fixed item" do
      it "includes a budgeted item without transactions" do
        item = base_item(category: monthly_expense)

        expect(base_detail_keys).to contain_exactly(item.key)
      end

      it "excludes an item with a transaction" do
        base_item(category: monthly_expense, spent: [ -10_00 ])

        expect(base_detail_keys).to be_empty
      end

      it "excludes an item budgeted at zero" do
        base_item(category: monthly_expense, amount: 0)

        expect(base_detail_keys).to be_empty
      end
    end

    context "with a variable expense item" do
      it "includes an item that is under budget" do
        item = base_item(category: variable_expense, spent: [ -60_00 ])

        expect(base_detail_keys).to contain_exactly(item.key)
      end

      it "excludes an item that is exactly on budget" do
        base_item(category: variable_expense, spent: [ -60_00, -40_00 ])

        expect(base_detail_keys).to be_empty
      end

      it "excludes an item that is over budget" do
        base_item(category: variable_expense, spent: [ -160_00 ])

        expect(base_detail_keys).to be_empty
      end
    end

    context "with a variable revenue item" do
      it "includes an item that has received less than budgeted" do
        item = base_item(category: variable_revenue,
          amount: 100_00, spent: [ 60_00 ])

        expect(base_detail_keys).to contain_exactly(item.key)
      end

      it "excludes an item that has been fully received" do
        base_item(category: variable_revenue, amount: 100_00, spent: [ 100_00 ])

        expect(base_detail_keys).to be_empty
      end
    end

    it "excludes deleted items" do
      base_item(category: monthly_expense).update!(deleted_at: Time.current)

      expect(base_detail_keys).to be_empty
    end

    it "excludes items from the upcoming interval" do
      target_item(category: monthly_expense)

      expect(base_detail_keys).to be_empty
    end

    it "excludes items belonging to another user group" do
      other_group = create(:user_group)
      other_category = create(:category, :monthly, :expense,
        user_group: other_group)
      other_interval = create(:budget_interval, user_group: other_group,
        month: base_interval.month, year: base_interval.year)
      budget_item(category: other_category, interval: other_interval,
        change_set: Budget::Changes::Setup.create(interval: other_interval),
        amount: -100_00)

      expect(base_detail_keys).to be_empty
    end
  end

  describe "#target_details" do
    it "returns upcoming items for categories with a reviewable base item" do
      base_item(category: variable_expense)
      target = target_item(category: variable_expense)

      expect(query.target_details.map(&:key)).to contain_exactly(target.key)
    end

    it "excludes upcoming items for categories with nothing to review" do
      base_item(category: monthly_expense, spent: [ -100_00 ])
      target_item(category: monthly_expense)

      expect(query.target_details).to be_empty
    end
  end

  describe "#all_details" do
    def category_for(category)
      query.all_details.map(&:to_h).find { |cat| cat["key"] == category.key }
    end

    context "with a variable category" do
      it "is a simple adjust when there is an upcoming item" do
        base_item(category: variable_expense)
        target_item(category: variable_expense)

        result = category_for(variable_expense)

        expect(result["target_events"].pluck("event_type"))
          .to contain_exactly("item_adjust")
      end
    end

    context "with a monthly category" do
      it "is complex with multiple review items and no upcoming item" do
        items = Array.new(2) { base_item(category: monthly_expense) }

        result = category_for(monthly_expense)

        expect(result["items"].pluck("key"))
          .to match_array(items.map(&:key))
        expect(result["target_events"].count).to be 2
      end

      it "is complex with one review item and an upcoming item" do
        item = base_item(category: monthly_expense)
        2.times { target_item(category: monthly_expense) }

        result = category_for(monthly_expense)

        expect(result["items"].pluck("key")).to contain_exactly(item.key)
        expect(result["target_events"].count).to be 3
      end
    end

    it "returns one object per reviewable category" do
      base_item(category: variable_expense)
      Array.new(2) { base_item(category: monthly_expense) }
      base_item(category: accrual_expense, spent: [ -100_00 ])
      expect(query.all_details.map { |cat| cat.to_h["key"] })
        .to contain_exactly(variable_expense.key, monthly_expense.key)
    end

    it "exposes the category's identifying attributes" do
      base_item(category: variable_expense)

      result = category_for(variable_expense)

      expect(result).to include(
        "key" => variable_expense.key,
        "slug" => variable_expense.slug,
        "name" => variable_expense.name
      )
    end
  end
end
