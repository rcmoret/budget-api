require "rails_helper"

RSpec.describe API::Budget::Interval::DraftDiscretionarySerializer do
  describe "#render" do
    subject { described_class.new(interval, items: items) }

    let(:user) { create(:user) }
    let(:group) { user.group }
    let(:expense) { create(:category, :weekly, name: "Groceries", user_group: group) }
    let(:interval) { create(:budget_interval, user_group: group) }
    let(:groceries) { create(:budget_item, category: expense, interval: interval) }
    let(:revenue) { create(:category, :monthly, name: "Salary", user_group: group) }
    let(:salary) { create(:budget_item, category: revenue, interval: interval) }

    before do
      create(:budget_item_event, :create_event, item: groceries, amount: -400_00)
      create(:budget_item_event, :create_event, item: salary, amount: 1_200_00)
      create(:transaction_detail, budget_item: groceries, amount: -450_00)
    end

    context "when passing an updated item" do
      let(:items) do
        [salary.decorated, updated_groceries]
      end
      let(:updated_groceries) do
        Budget::DraftItem.new(
          Forms::Budget::DraftChangeForm.new(
            interval,
            budget_item_key: groceries.key,
            budget_category_key: expense.key,
            amount: update_amount,
          )
        )
      end

      context "when the updated amount is less than the prev over budget" do
        let(:update_amount) { -15_00 }

        it "returns to correct amount and over/under budget" do
          expect(subject.amount).to be 1_200_00
          expect(subject.over_under_budget).to be(-35_00)
        end
      end

      context "when the updated amount is greater than the prev over budget" do
        let(:update_amount) { -75_00 }

        it "returns to correct amount and over/under budget" do
          expect(subject.amount).to be 1_175_00
          expect(subject.over_under_budget).to be_zero
        end
      end
    end

    context "when passing a new item" do
      let(:util_category) { create(:category, :monthly, :expense, name: "Utilities", user_group: group) }
      let(:item_key) { SecureRandom.hex(6) }
      let(:utilities) do
        Budget::DraftItem.new(
          Forms::Budget::DraftChangeForm.new(
            interval,
            budget_item_key: item_key,
            budget_category_key: util_category.key,
            amount: -142_00,
          )
        )
      end
      let(:items) do
        [
          salary.decorated,
          groceries.decorated,
          utilities,
        ]
      end

      it "returns the updated amount, same over/under" do
        expect(subject.amount).to be 1_058_00
        expect(subject.over_under_budget).to be(-50_00)
      end
    end
  end
end
