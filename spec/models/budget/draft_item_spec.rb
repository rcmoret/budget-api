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
      let(:category) { create(:category, :expense, :weekly, user_group: user_group) }
      let(:change) do
        {
          interval: interval,
          budget_item_key: item.key,
          category_id: category.id,
          amount: -15_00,
        }
      end
      let(:expected) do
        {
          amount: item.amount + change[:amount],
          impact: (item.spent - item.amount - change[:amount]),
        }
      end

      before do
        create(:budget_item_event, :create_event, amount: -100_00, item: item)
        create(:transaction_detail, budget_item: item, amount: -130_00)
      end

      it "returns an adjusted item" do
        expect(subject.amount).to eq expected[:amount]
        expect(subject.budget_impact).to eq expected[:impact]
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
          category_id: category.id,
          amount: -32_00,
        }
      end

      it "returns a proposed item" do
        expect(subject.amount).to eq change[:amount]
        expect(subject.budget_impact).to be_zero
        expect(subject.persisted?).to be false
      end
    end
  end
end
