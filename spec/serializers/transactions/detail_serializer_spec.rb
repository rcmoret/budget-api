require "rails_helper"

RSpec.describe Transactions::DetailSerializer do
  subject { described_class.new(transaction_detail) }

  let(:user_group) { FactoryBot.create(:user_group) }
  let(:icon) { FactoryBot.create(:icon) }
  let(:interval) { FactoryBot.create(:budget_interval, user_group: user_group) }
  let(:category) do
    FactoryBot.create(
      :category,
      user_group: user_group,
      icon: icon,
    )
  end
  let(:budget_item) do
    FactoryBot.create(:budget_item, category: category, interval: interval)
  end
  let(:detail_key) { SecureRandom.hex(6) }
  let(:amount) { rand(-100..200) }
  let(:transaction_entry) do
    FactoryBot.create(
      :transaction_entry,
      account: FactoryBot.create(:account, user_group: user_group),
      details_attributes: [
        {
          key: detail_key,
          budget_item: budget_item,
          amount: amount,
        },
      ]
    )
  end
  let(:transaction_detail) { transaction_entry.details.first }

  describe "#key" do
    specify { expect(subject.key).to eq detail_key }
  end

  describe "#amount" do
    specify { expect(subject.amount).to eq amount }
  end

  describe "#budget_item_key" do
    context "when the budget item exists" do
      specify { expect(subject.budget_item_key).to eq budget_item.key }
    end

    context "when the budget item is nil" do
      let(:budget_item) { nil }

      specify { expect(subject.budget_item_key).to be_nil }
    end
  end

  describe "#budget_category_name" do
    context "when the budget item exists" do
      specify { expect(subject.budget_category_name).to eq category.name }
    end

    context "when the budget item is nil" do
      let(:budget_item) { nil }

      specify { expect(subject.budget_category_name).to be_nil }
    end
  end

  describe "#icon_class_name" do
    context "when the budget item exists" do
      specify { expect(subject.icon_class_name).to eq icon.class_name }
    end

    context "when the budget item is nil" do
      let(:budget_item) { nil }

      specify { expect(subject.icon_class_name).to be_nil }
    end
  end

  describe "#render" do
    it "returns a hash with the expected keys" do
      expect(subject.render.keys)
        .to contain_exactly("key", "amount", "budgetItemKey", "budgetCategoryName", "iconClassName")
    end
  end
end
