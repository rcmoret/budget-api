require "rails_helper"

RSpec.describe API::Budget::Interval::DraftSerializer do
  describe "#discretionary" do
    subject { described_class.new(interval, changes: []) }

    let(:user) { create(:user) }
    let(:interval) { create(:budget_interval, user_group: user.group) }
    let(:discretionary_serializer_double) do
      instance_double(API::Budget::Interval::DraftDiscretionarySerializer)
    end

    before do
      allow(API::Budget::Interval::DraftDiscretionarySerializer)
        .to receive(:new)
        .with(interval, items: anything)
        .and_return(discretionary_serializer_double)
    end

    it "returns the discretionary serializer" do
      expect(subject.discretionary).to eq discretionary_serializer_double
    end
  end

  describe "#items" do
    subject { described_class.new(interval, changes: changes) }

    let(:user) { create(:user) }
    let(:changes) do
      [
        Forms::Budget::DraftChangeForm.new(
          interval,
          budget_item_key: groceries.key,
          budget_category_key: expense.key,
          amount: -15_00,
        ),
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
              "budgetCategoryName" => expense.name,
              "budgetCategoryKey" => expense.key,
              "iconClassName" => expense.icon_class_name,
              "isMonthly" => expense.monthly,
              "isNewItem" => false,
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
      let(:item_key) { KeyGenerator.call }
      let(:changes) do
        [
          Forms::Budget::DraftChangeForm.new(
            interval,
            budget_item_key: item_key,
            budget_category_key: util_category.key,
            amount: -142_00,
          ),
        ]
      end

      it "returns the new draft items" do
        expect(subject.items.render).to eq(
          [
            {
              "name" => "Utilities",
              "key" => item_key,
              "budgetCategoryName" => util_category.name,
              "budgetCategoryKey" => util_category.key,
              "iconClassName" => util_category.icon_class_name,
              "isMonthly" => util_category.monthly,
              "isNewItem" => true,
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
