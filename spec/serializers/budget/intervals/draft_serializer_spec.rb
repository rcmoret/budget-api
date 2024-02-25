require "rails_helper"

RSpec.describe Budget::Intervals::DraftSerializer do
  describe "#days_remaining" do
    subject { described_class.new(user, interval) }

    let(:user) { create(:user) }
    let(:interval) do
      create(
        :budget_interval,
        user_group: user.group,
        start_date: Date.new(2022, 3, 1),
        end_date: Date.new(2022, 3, 31)
      )
    end
  end

  describe "#discretionary" do
    subject { described_class.new(user, interval, changes: []) }

    let(:user) { create(:user) }
    let(:interval) { create(:budget_interval, user_group: user.group) }
    let(:discretionary_serializer_double) do
      instance_double(Budget::Intervals::DraftDiscretionarySerializer)
    end

    before do
      allow(Budget::Intervals::DraftDiscretionarySerializer)
        .to receive(:new)
        .with(interval, items: anything)
        .and_return(discretionary_serializer_double)
    end

    it "returns the discretionary serializer" do
      expect(subject.discretionary).to eq discretionary_serializer_double
    end
  end

  describe "#items" do
    subject { described_class.new(user, interval, changes: changes) }

    let(:user) { create(:user) }
    let(:changes) do
      [
        {
          interval: interval,
          budget_item_key: groceries.key,
          budget_category_key: expense.key,
          amount: -15_00,
        },
      ]
    end
    let(:group) { user.group }
    let(:expense) { create(:category, :weekly, name: "Groceries", user_group: group) }
    let(:interval) { create(:budget_interval, user_group: group) }
    let(:groceries) { create(:budget_item, category: expense, interval: interval) }
    let(:revenue) { create(:category, :monthly, name: "Salary", user_group: group) }
    let(:salary) { create(:budget_item, category: revenue, interval: interval) }

    context "when passing an existing item" do
      before do
        create(:budget_item_event, :create_event, item: groceries, amount: -400_00)
        create(:budget_item_event, :create_event, item: salary, amount: 1_200_00)
        create(:transaction_detail, budget_item: groceries, amount: -450_00)
      end

      it "returns the change items" do
        expect(subject.items.render).to eq(
          [
            {
              "name" => "Groceries",
              "key" => groceries.key,
              "budgetCategoryKey" => expense.key,
              "amount" => -415_00,
              "difference" => 35_00,
              "remaining" => 0,
              "spent" => -450_00,
            },
          ]
        )
      end
    end

    context "when adding a new item" do
      let(:util_category) { create(:category, :monthly, :expense, name: "Utilities", user_group: group) }
      let(:item_key) { SecureRandom.hex(6) }
      let(:changes) do
        [
          {
            interval: interval,
            budget_item_key: item_key,
            budget_category_key: util_category.key,
            amount: -142_00,
          },
        ]
      end

      it "returns the new draft items" do
        expect(subject.items.render).to eq(
          [
            {
              "name" => "Utilities",
              "key" => item_key,
              "budgetCategoryKey" => util_category.key,
              "amount" => -142_00,
              "difference" => -142_00,
              "remaining" => -142_00,
              "spent" => 0,
            },
          ]
        )
      end
    end
  end
end
