require "rails_helper"

RSpec.describe Transaction::Detail, type: :model do
  describe "associations" do
    subject do
      described_class.new(amount: -1000, budget_item: budget_item)
    end

    let(:budget_item) { FactoryBot.create(:budget_item) }

    it { is_expected.to belong_to(:entry).required }
    it { is_expected.to belong_to(:budget_item).optional(true) }
  end

  describe "validations" do
    let(:entry) { FactoryBot.create(:transaction_entry) }

    describe "a valid detail" do
      it "returns true for valid?" do
        detail = described_class.new(transaction_entry_id: entry.id, amount: 100, key: SecureRandom.hex(6))
        expect(detail).to be_valid
      end
    end

    describe "entry validation" do
      it "returns false for valid?" do
        expect(described_class.new(transaction_entry_id: nil, amount: 0))
          .not_to be_valid
      end

      it "has an error if not present" do
        detail = described_class.new(transaction_entry_id: nil, amount: 0)
        detail.valid?
        expect(detail.errors[:entry]).to include "must exist"
      end
    end

    describe "amount validation" do
      it "validates the presence" do
        detail = described_class.new transaction_entry_id: entry.id, amount: nil
        expect(detail).not_to be_valid
      end

      it "validates the presence of amount" do
        detail = described_class.new transaction_entry_id: entry.id, amount: nil
        detail.valid?
        expect(detail.errors["amount"]).to include "can't be blank"
      end
    end

    describe "budget item validation (for monthly items)" do
      subject { described_class.new(budget_item: item, entry: entry) }

      before do
        FactoryBot.create(:transaction_detail, entry: entry, budget_item: item)
      end

      let(:entry) { FactoryBot.create(:transaction_entry) }
      let(:item) { FactoryBot.create(:monthly_expense) }

      it { is_expected.not_to be_valid }

      it "has an error" do
        subject.valid?
        expect(subject.errors[:budget_item_id])
          .to include "has already been taken"
      end
    end

    describe "amount changed raises an error if transfer" do
      let(:transfer) { FactoryBot.create(:transfer) }
      let(:entry) { transfer.to_transaction }
      let(:detail) { entry.reload.details.first }

      before { detail.update(amount: (detail.amount * 2)) }

      it "returns not valid" do
        expect(detail.valid?).to be false
      end

      it "has an error message" do
        detail.valid?

        expect(detail.errors[:amount]).to include("Cannot be changed for a transfer")
      end
    end
  end
end
