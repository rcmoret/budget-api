require "rails_helper"

RSpec.describe Budget::DraftItem do
  describe "#amount" do
    subject do
      described_class.new(**change)
    end

    context "when passing a key for an existing item" do
      let(:user_group) { create(:user_group) }
      let(:interval) { create(:budget_interval, user_group: user_group) }
      let(:item) { create(:budget_item, interval: interval, category: category) }
      let(:category) { create(:category, user_group: user_group) }
      let(:change) do
        {
          interval: interval,
          budget_item_key: item.key,
          budget_category_key: category.key,
          amount: -20_00,
        }
      end
      let(:expected_amount) do
        item.amount + change[:amount]
      end

      before do
        create(:budget_item_event, :create_event, amount: -200_00, item: item)
      end

      it "returns an adjusted item" do
        expect(subject.amount).to eq expected_amount
        expect(subject.persisted?).to be true
      end
    end

    context "when passing a key for a proposed item" do
      let(:user_group) { create(:user_group) }
      let(:interval) { create(:budget_interval, user_group: user_group) }
      let(:category) { create(:category, user_group: user_group) }
      let(:change) do
        {
          interval: interval,
          budget_item_key: SecureRandom.hex(6),
          budget_category_key: category.key,
          amount: -32_00,
        }
      end

      it "returns a proposed item" do
        expect(subject.amount).to eq change[:amount]
        expect(subject.persisted?).to be false
      end
    end
  end
end
